<template>
  <div class="q-pa-md" v-if="filesService2.data">
    <h3 v-if="listItems2">
      test ({{listItems2.length}}/{{filesService2.total}})
    </h3>
    <button @click="add">Add s</button>
    <div class="row">
      <ul class="col">
        <li v-for="item in listItems"
        :key="item._id">
          {{item.num}} {{item._id}}
          <button @click="remove(item._id)">x</button>
          <button @click="filesService.patch(item._id, {num: +!item.num})">*</button>
        </li>
      </ul>
      <ul class="col">
        <li v-for="item in listItems1"
        :key="item._id+1">
          {{item.num}} {{item._id}}
          <button @click="remove(item._id)">x</button>
          <button @click="filesService.patch(item._id, {num: +!item.num})">*</button>
        </li>
      </ul>
      <ul class="col">
        <li v-for="item in listItems2"
        :key="item._id+2">
          {{item.num}} {{item._id}}
          <button @click="remove(item._id)">x</button>
          <button @click="filesService.patch(item._id, {num: +!item.num})">*</button>
        </li>
        <button @click="filesService2.loadMore()">load more...</button>
        <div class="row">
          <button v-for="(b, i) in new Array(Math.ceil(filesService2.total / (filesService2.limit ? filesService2.limit : 1)))"
          :key="'123'+b+i"
          @click="filesService2.loadPage(i+1)" >
            {{i+1}}
          </button>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    add () {
      this.filesService.create({
        num: Math.round(Math.random())
      })
    },
    remove (_id) {
      this.filesService.remove(_id)
    }
  },
  beforeDestroy () {
    this.filesService.destroy()
    this.filesService1.destroy()
    this.filesService2.destroy()
    // console.log('TYPE OF', typeof this.authListner)
    this.$dbConn.removeListener('authenticated', this.authListner)
  },
  mounted () {
    this.$dbConn.authenticate()
    this.authListner = async res => {
      console.log('auth Trin')
      this.filesService = this.$dbConn.wingsService('juan-files', {
        query: {
          num: 0
        }
      }, {
        channels: [
          {
            prop: 'num',
            value: function (val) {
              return val === 0
            }
          }
        ]
      }).on('dataChange', dd => {
        this.listItems = dd
      }).init()

      this.filesService1 = this.$dbConn.wingsService('juan-files', {
        query: {
          num: 1
        }
      }, {
        channels: [
          {
            prop: 'num',
            value: 1
          }
        ]
      }).on('dataChange', dd => {
        this.listItems1 = dd
      }).init()

      this.filesService2 = this.$dbConn.wingsService('juan-files', {
        query: { $limit: 5 }
      },
      {
        newDataPosition: 'end',
        paginate: true,
        debug: true
      }).on('dataChange', (dd, wings) => {
        wings.log('test', dd)
        this.listItems2 = dd
      }).init()
    }

    this.$dbConn.on('authenticated', this.authListner)
  },
  data: () => ({
    listItems: [],
    listItems1: [],
    listItems2: [],
    filesService: { data: [], total: 0, limit: 0 },
    filesService1: { data: [], total: 0, limit: 0 },
    filesService2: { data: [], total: 0, limit: 0 },
    authListner: null
  })
}
</script>
