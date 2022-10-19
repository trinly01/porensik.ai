const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const sso = require('./single.sign.on.js');
const jwtDecode = require('jwt-decode');


module.exports = function (app) {
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local());
  // app.configure(sso({ url: 'http://localhost:3536' }));
  app.configure(sso({ url: 'http://10.10.120.32:3536' }));

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies),
        async hook => {
          // console.log(hook.app)
          if(hook.data.accessToken) {
            console.log(hook.data)
            // const userId = jwtDecode(hook.data.accessToken)
            // console.log(userId)
            const { user } = hook.app.authenticate({
              strategy: 'jwt',
              accessToken: hook.data.accessToken
            })
            console.log('user', user)
            // hook.result.user = await hook.app.service('users').get(userId)
          }
        }
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    },
    after: {
      all: [
        hook => {
          // console.log('param', hook.result)
        }
      ],
      create: [
        hook => {
          hook.result.user = hook.params.user
        }
      ]
    }
  });
};
