import io from 'socket.io-client'

// import feathers from '@feathersjs/feathers'
// import auth from '@feathersjs/authentication-client'
// import socketio from '@feathersjs/socketio-client'
import feathers from '@feathersjs/client/dist/feathers.min.js'
let auth = feathers.authentication
let socketio = feathers.socketio

import EventEmitter from 'events'
//  forEach, some,
import { isEmpty, ceil, findIndex, unionBy, isFunction, isArray } from 'lodash'
const localforage = require('localforage')

export default (host, services) => {
  host = host || 'http://localhost:3030' // IP and port of the server
  let socket = io(host)

  let app = feathers()

  app
    .configure(socketio(socket, {
      timeout: 180000
    }))
    .configure(auth({
      jwtStrategy: 'jwt', // the name of the JWT authentication strategy
      entity: 'user', // the entity you are authenticating (ie. a users)
      service: 'users', // the service to look up the entity
      cookie: host + '-jwt', // the name of the cookie to parse the JWT from when cookies are enabled server side
      storageKey: host + '-jwt', // the key to store the accessToken in localstorage or AsyncStorage on React Native
      storage: window.localStorage // Passing a WebStorage-compatible object to enable automatic storage on the client.
    }))

  app.serve = async (serviceName, defaultQuery) => {
    let service = app.service(serviceName)

    service.status = 'offline'
    service.total = 0
    service.data = []
    service.skip = 0
    service.page = 1
    service.limit = 10
    service.debug = defaultQuery ? (defaultQuery.debug || false) : false

    service.defaultQuery = { channels: [], query: {}, ...defaultQuery }

    let store = localforage.createInstance({
      name: `${app.io.io.uri}/${serviceName}`
    })

    let event = new EventEmitter()

    service.logger = (func, message, ...params) => {
      if (service.debug) {
        console.log('wings-' + serviceName, func, message, ...params)
      }
    }

    service.onDataChange = (listner) => {
      // let listners = event._events.dataChange
      // let ind = isArray(event._events.dataChange) ? event._events.dataChange.length - 1 : 0

      let removeListener = () => {
        if (isArray(event._events.dataChange)) {
          let ind = event._events.dataChange.length - 1
          // event._events.dataChange.splice(ind, 1)
          event.removeListener(event._events.dataChange[ind])
          service.logger(`removeListener[${ind}]`, 'listening...')
        } else {
          service.logger('LISTENERS', event._events)
          event.removeListener('dataChange', event._events.dataChange)
          service.logger(`removeListener`, 'listening...')
        }
      }

      event.on('dataChange', async data => {
        service.logger('dataChange', data)

        listner(data, removeListener)
        if (service.data.length) {
          await store.setItem('total', service.total)
          await store.setItem('data', service.data)
          await store.setItem('skip', service.skip)
          await store.setItem('page', service.page)
          await store.setItem('limit', service.limit)
        }
      })

      service.logger('onDataChange', 'listening...', event._events)

      return { listners: event._events.dataChange, removeListener }
    }

    service.reQuery = (q = {}, options) => {
      let opt = {
        triggerInit: true,
        action: 'update', // update,
        ...options
      }
      service.debug = q.debug || service.debug
      service.logger(`reQuery`, { q, options })
      // if (isUndefined(q.query)) q.query = { $skip: 0 }
      if (opt.action === 'update') {
        service.defaultQuery = q
      } else if (opt.action === 'patch') {
        if (q) q.query = { ...service.defaultQuery.query, ...q.query }
        service.defaultQuery = { ...service.defaultQuery, ...q }
      }
      service.page = 1
      if (opt.triggerInit) return service.init()
    }

    service.init = async () => {
      service.logger(`init`, service.defaultQuery)
      let findPromise = service.find(service.defaultQuery)
      findPromise.catch(async error => {
        console.error(`${serviceName} service`, error)
        if (service.connection.authentication) {
          service.total = await store.getItem('total') || 0
          service.data = await store.getItem('data') || []
          service.skip = await store.getItem('skip') || 0
          service.page = await store.getItem('page') || 0
          service.limit = await store.getItem('limit') || 0
        } else {
          service.total = 0
          service.data = []
          service.skip = 0
          service.page = 1
          service.limit = 0
        }

        if (!event._events) {
          service.status = 'offline'
        }
        event.emit('dataChange', [...service.data])
      })
      const result = await findPromise
      service.data = result.data
      service.status = 'online'
      service.total = result.total
      service.limit = result.limit
      event.emit('dataChange', result.data)

      return findPromise
    }

    service.loadMoreData = async () => {
      let pages = ceil(service.total / 10)
      if ((service.page) <= pages) {
        service.defaultQuery.query = Object.assign(service.defaultQuery.query, {
          $skip: service.page * service.limit
        })
        const result = await service.find(service.defaultQuery)
        service.total = result.total
        // console.log('result.skip', service.page)
        service.page++
        service.logger('loadMoreData', result.data)
        service.data = unionBy(service.data, result.data, '_id')
        event.emit('dataChange', service.data)
      } else {
        service.logger('loadMoreData', 'All data was loaded')
      }
    }

    service.loadAllData = async () => {
      let pages = ceil(service.total / 10)
      if ((service.page) <= pages) {
        await service.loadMoreData()
        service.loadAllData()
      } else {
        service.logger('loadAllData', 'All data was loaded')
      }
    }

    service.inChannel = message => {
      return isArray(service.defaultQuery.channels) ? service.defaultQuery.channels.filter(ch => {
        let nestedProp = ch.prop.split('.').reduce((o, i) => o[i], message)
        if (isFunction(ch.value)) {
          return ch.value(nestedProp, message)
        } else {
          return ch.value === nestedProp
        }
      }).length : true
    }

    service.on(`created`, message => {
      service.total = service.total + 1
      const inChannel = service.inChannel(message)
      service.logger('created', message, inChannel)
      if (inChannel || !service.defaultQuery.channels.length) { // wala sa data pero meron sa channel, so add it
        let position = service.defaultQuery.newDataPosition || 'start'
        if (position === 'start') service.data.unshift(message); else service.data.push(message)
        event.emit('dataChange', service.data)
      }
    })

    service.on(`removed`, message => {
      service.total = service.total - 1
      let index = findIndex(service.data, { _id: message._id })
      service.logger('removed', message, index)
      if (index > -1) {
        service.data.splice(index, 1)
        event.emit('dataChange', service.data)
      }
    })

    service.modifyData = (message, type = 'patched') => {
      const inChannel = service.inChannel(message)
      let index = findIndex(service.data, { _id: message._id })
      // let channelLength = service.defaultQuery.channels.length
      if ((index > -1 && (inChannel)) || !service.defaultQuery.channels.length) { // meron sa data and meron sa channel
        service.data[index] = type ? Object.assign(service.data[index], message) : message
        event.emit('dataChange', service.data)
      } else if (index < 0 && inChannel) { // wala sa data pero meron sa channel, so add it
        let position = service.defaultQuery.newDataPosition || 'start'
        if (position === 'start') service.data.unshift(message); else service.data.push(message)
        event.emit('dataChange', service.data)
      } else if (index > -1 && !(inChannel)) { // meron sa data pero WALA sa channel, so remove it
        service.data.splice(index, 1)
        event.emit('dataChange', service.data)
      }
      service.logger('type', message, inChannel)
    }

    service.on(`patched`, message => {
      service.modifyData(message)
    })

    service.on(`updated`, message => {
      service.modifyData(message, 'updated')
    })

    app.io.on('disconnect', () => {
      service.status = 'offline'
      event.emit('dataChange', [...service.data])
      service.logger('disconnect', service.status)
    })
    app.io.on('connect', () => {
      service.status = 'online'
      if (service.data.length) {
        service.reQuery()
      }
      service.logger('connect', service.status)
    })

    await service.init()

    return service
  }

  // Initialize and reQuery

  for (var key in services) {
    if (isEmpty(services[key])) {
      app.serve(key).catch(() => {})
    } else {
      app.serve(key, services[key]).catch(() => {})
    }
  }

  app.reQuery = async () => {
    for (var key in app.services) {
      await app.services[key].reQuery()
    }
  }

  app.on('logout', app.reQuery)

  return app
}
