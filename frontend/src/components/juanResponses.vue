<style scoped>
</style>
<template>
  <q-layout class="bg-white text-black" container style="min-width: 80vw;">
    <q-header class="bg-white text-black shadow-up-1">
      <q-toolbar class="">
        <q-btn flat round dense icon="data_usage" color="purple" />
        <q-toolbar-title>Responses</q-toolbar-title>
        <q-toolbar-title><i class="text-body1">{{ node.label }}</i></q-toolbar-title>
        <q-btn flat v-close-popup round dense icon="close" />
      </q-toolbar>
    </q-header>
    <q-page-container class="q-pa-lg col" ref='printable'>
      <div class="q-pt-lg col">
        <q-table
          virtual-scroll
          :grid="grid"
          v-if="responsesSrvc && tab === 'list'"
          :data="responses"
          :columns="columns"
          row-key="_id"
          :pagination.sync="pagination"
          :loading="loading"
          @update:pagination="customSort"
          binary-state-sort
        >
          <template v-slot:body="props">
            <tr
              @mouseover="hover = props.row._id"
            >
              <td>
                <div v-if="props.row._id === hover" class="q-gutter-sm">
                  <!-- <q-btn icon="fas fa-qrcode" class="text-black" color="white" size="sm" round
                    @click="() => $refs['qr'+props.row._id].show()"
                  >
                    <qrEncrypt :ref="'qr'+props.row._id" :value="props.row" />
                  </q-btn> -->
                  <q-btn icon="remove_red_eye" color="purple" size="sm" round
                    @click="openResponse(props.row)"
                  />
                  <q-btn
                    v-if="($root.user._id === node.owner || $lodash.findIndex(node.security.removers, user => user.value._id === $root.user._id) > -1)"
                  icon="delete" color="negative" size="sm" round @click="removeResponse(props.row)" />
                </div>
              </td>
              <td>
                {{ props.row._id.substr(0, 3) }} {{ props.row._id.substr(-3, 3) }}
              </td>
              <td class="text-right" v-for="que in node.format" :key="que.field" :props="props">
                <div v-if="props.row[que.field]">
                  <span v-if="que.type === 'Text' || que.type.value === 'Text'">
                    <!-- {{que.field}} -->
                    {{ props.row[que.field] }}
                  </span>
                  <div v-else-if="que.type.value === 'Select'">
                    <span v-if="!que.isMultiple"> {{ props.row[que.field].value || props.row[que.field] }} </span>
                    <q-chip v-else v-for="(v, i) in props.row[que.field]" :key="props.row._id + i" :label="v.value" dense color="purple" class="text-white"/>
                  </div>
                  <span v-else-if="que.type.value === 'Date'">
                    {{ $moment(props.row[que.field]).format('YYYY-MM-DD') }}
                  </span>
                  <span v-else-if="que.type.value === 'digiSign'">
                    {{ props.row[que.field].displayName }} <br/>
                    {{ props.row[que.field].datetime ? $moment(props.row[que.field].datetime).format('YYYY-MM-DD') : '' }}
                  </span>
                  <div v-else>
                    {{ props.row[que.field] }}
                  </div>
                </div>
              </td>
            </tr>
          </template>
          <template v-slot:top-right>
            <div class="row q-gutter-md">
               <q-btn flat round :icon="grid ? 'grid_on' : 'table_chart'" color="blue-grey" @click="grid = !grid" />
              <q-input @input="customSort(pagination)" borderless dense debounce="750" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </template>
          <template v-slot:bottom>
            <div class="col">
              Total records: {{ responsesSrvc.total }}
            </div>
            <div class="row q-gutter-sm items-center">
              <q-btn :disabled="responsesSrvc.page === 1" round icon="chevron_left" flat size="sm" @click="responsesSrvc.loadPage(responsesSrvc.page - 1)" />
              <div>
                page {{ responsesSrvc.page }} of {{ $lodash.ceil(responsesSrvc.total / responsesSrvc.limit) }}
              </div>
              <q-btn :disabled="responsesSrvc.page === $lodash.ceil(responsesSrvc.total / responsesSrvc.limit)" round icon="chevron_right" flat size="sm" @click="responsesSrvc.loadPage(responsesSrvc.page + 1)" />
            </div>
          </template>
        </q-table>
        <stat v-else-if="responsesSrvc && tab === 'stat'" :node="node" />
      </div>
    </q-page-container>
    <q-footer>
      <q-toolbar class="bg-white text-black shadow-1">
        <!-- <q-btn
          v-if="responses.length"
          @click="exportCSV"
          size="md"
          flat
          color="purple"
          label="download"
          icon="fas fa-file-csv" /> -->
        <q-btn-dropdown icon="fas fa-file-download" size="md" flat color="purple" label="download">
          <q-list>
            <q-item clickable v-close-popup @click="exportCSV('csv')">
              <q-item-section>
                <q-item-label>csv</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="exportCSV('xlsx')">
              <q-item-section>
                <q-item-label>xlsx</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          @click="generateMigrationTemplate"
          size="md"
          flat
          color="purple"
          label="migration template"
          icon="fas fa-file-csv" />
        <input v-show="false" ref="uploadMigrationButton"
          @change="uploadMigrationData" type="file" />
        <q-btn
          v-if="($root.user._id === node.owner)"
          @click="() => {
            $refs.uploadMigrationButton.value = ''
            $refs.uploadMigrationButton.click()
          }"
          :loading="loading"
          size="md"
          flat
          color="purple"
          label="Upload Data"
          icon="fas fa-file-upload" />
        <q-toolbar-title></q-toolbar-title>
        <q-btn-toggle
          class="bg-grey-3"
          v-if="this.$root.user._id === node.owner || $lodash.findIndex(node.security.modifiers, user => user.value._id === $root.user._id) > -1"
          rounded
          unelevated
          v-model="tab"
          toggle-color="purple"
          text-color="purple"
          :options="[
            {label: 'List', value: 'list', icon: 'list'},
            {label: 'Stat', value: 'stat', icon: 'insert_chart_outlined'}
          ]"
        />
      </q-toolbar>
    </q-footer>
    <q-dialog if="viewFormIsOpen" v-model="viewFormIsOpen" persistent>
      <view-form :node="node" :response="response"></view-form>
    </q-dialog>
  </q-layout>
</template>

<script>
// import viewForm from 'components/viewForm.vue'
import stat from 'components/stat.vue'
// import qrEncrypt from 'components/qrEncrypt.vue'
export default {
  props: ['refs', 'node', 'userID'],
  components: {
    viewForm: () => import('components/viewForm.vue'),
    stat
    // qrEncrypt
  },
  beforeDestroy () {
    this.responsesSrvc.destroy()
  },
  mounted () {
    this.loading = true
    this.responsesSrvc = this.$dbCon.wingsService('juan-responses').on('dataChange', responses => {
      this.responses = responses
      console.log(responses, this.responsesSrvc.total)
      this.loading = false
    })
    this.customSort({ pagination: this.pagination })
  },
  computed: {
    columns () {
      let cols = this.node.format.map(q => ({
        name: q.field,
        label: q.field,
        field: q.field,
        // align: 'left',
        // field: row => row.name,
        // format: val => `${val}`,
        sortable: true
      }))

      Array.prototype.unshift.apply(cols, [{
        name: '_id',
        label: 'ID',
        field: '_id'
      }])

      Array.prototype.unshift.apply(cols, [{
        name: 'view-form',
        label: '',
        field: 'view-form'
      }])

      // console.log('pogi', cols)
      return cols
    }
  },
  data () {
    return {
      tab: 'list',
      grid: false,
      viewFormIsOpen: false,
      response: {},
      hover: null,
      responsesSrvc: null,
      responses: [],
      loading: false,
      filter: '',
      page: 1,
      pagination: {
        sortBy: this.node.format[0].field,
        descending: false,
        page: 1,
        rowsPerPage: 10
      }
    }
  },
  methods: {
    customSort (props) {
      console.log('triggered', props)
      let { sortBy, descending } = props
      this.loading = true
      let config = {
        paginate: true,
        channels: [
          { prop: 'formID', value: this.node._id }
        ]
      }
      let params = {
        query: {
          formID: this.node._id,
          $search: this.$root.user._id
        }
      }
      console.log('userId', this.$root.user._id)
      if (this.userID) {
        params.query.$or = [{
          userID: this.userID
        }]
        console.log('format', this.node.format)
        this.node.format.map(que => {
          if (que.type.value && que.type.value === 'digiSign') {
            console.log(que.type.value)
            let obj = {}
            obj[`${que.field}.assignedTo.value._id`] = this.userID
            params.query.$or.push(obj)
            config.channels.push({
              prop: `${que.field}.assignedTo.value._id`,
              value: this.userID
            })
          }
        })
        config.channels.push({
          prop: 'userID',
          value: this.userID
        })
        if (this.$lodash.findIndex(this.node.security.modifiers, user => user.value._id === this.userID) > -1) {
          delete params.query.$or
          delete params.query.$search
        }
      }
      if (this.$root.user._id === this.node.owner) {
        params.query.$or = [{
          formID: this.node._id
        }]
        delete params.query.$search
      }
      // console.log('this.filter', this.filter)
      if (this.filter) params.query.$search = this.filter
      // console.log('this.filter', this.filter)
      if (sortBy) {
        let $sort = {}
        $sort[sortBy] = descending ? -1 : 1
        params.query.$sort = $sort
      }
      this.query = { params, config }
      // if (this.$root.user._id === this.node.owner) delete params.query.$search
      console.log('params', params)
      this.responsesSrvc.reset(params, config)
      console.log('sortBy', params)
    },
    async uploadMigrationData () {
      // this.$refs.uploadMigrationButton.click()
      let file = this.$refs.uploadMigrationButton.files[0]
      console.log('File', file)

      var reader = new FileReader()
      this.loading = true
      reader.onload = async (e) => {
        const data = e.target.result
        const rows = this.$xlsx.utils.sheet_to_json(this.$xlsx.read(data, { type: 'binary', cellDates: true }).Sheets['Sheet1'])
        // console.log('data', rows)

        const validData = rows.map(r => {
          const obj = {
            formID: this.node._id,
            userID: this.$root.user._id,
            dateSubmitted: Date.now()
          }
          for (const q of this.node.format) {
            if (r[q.field]) {
              if (typeof r[q.field].getMonth === 'function') {
                obj[q.field] = r[q.field].getTime()
              } else {
                obj[q.field] = r[q.field]
              }
            }
          }
          return obj
        }).filter(r => Object.entries(r).length)

        console.log('validData', validData)

        for (const data of validData) {
          await this.responsesSrvc.create(data)
        }

        this.loading = false

        this.$q.notify({
          message: 'Responses Migrated',
          position: 'bottom-right',
          color: 'positive'
        })
      }
      reader.readAsBinaryString(file)
    },
    async generateMigrationTemplate () {
      // console.log('Bem Opriasa', this.node.format)
      const obj = {}
      for (const q of this.node.format) {
        obj[q.field] = ['Date', 'Time'].filter(i => i === q.type.label).length ? new Date() : ''
      }
      const arr = [obj]
      // console.log('Arr', arr)
      this.$arrayToCSV(arr, 'Migration ' + this.node.label + ' - ' + Date.now() + '.csv')
    },
    async exportCSV (extension) {
      let arr = []
      this.query.params.query.$limit = 500
      let { data } = await this.responsesSrvc.find(this.query.params)
      console.log('data po', data)
      for (const row of data) {
        let rec = {}
        for (const que of this.node.format) {
          rec.id = row._id.substr(0, 3) + ' ' + row._id.substr(-3, 3)
          if (que.type.value === 'Select') {
            rec[que.field] = !que.isMultiple && row[que.field] ? row[que.field].value : Array.isArray(row[que.field]) ? row[que.field].map(v => v.value).join(', ') : 'n/a'
          } else if (que.type.value === 'digiSign') {
            rec[`${que.field} - Signer`] = row[que.field] ? row[que.field].displayName : 'n/a'
            rec[`${que.field} - date`] = row[que.field] ? this.$moment(row[que.field].datetime).format('YYYY-MM-DD') : ''
          } else if (que.type.value === 'Date') {
            rec[que.field] = this.$moment(row[que.field]).format('YYYY-MM-DD')
          } else {
            rec[que.field] = row[que.field]
          }
        }
        rec.dateSubmitted = this.$moment(row.dateSubmitted).format('YYYY-MM-DD')
        arr.push(rec)
      }
      this.$arrayToCSV(arr, this.node.label + ' - ' + Date.now() + '.' + (extension || 'csv'))
    },
    openResponse (res) {
      this.response = res
      this.viewFormIsOpen = true
    },
    removeResponse (res) {
      this.$q.dialog({
        title: 'Approval Authentication',
        html: true,
        message: 'Are you sure you want to delete <b>' + res._id + '</b>? <br> Enter Password',
        prompt: {
          model: '',
          type: 'password' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(async data => {
        console.log('>>>> OK, received', data)
        try {
          await this.$axios.post(this.$dbCon.io.io.uri + '/authentication', {
            email: this.$root.user.email,
            password: data,
            strategy: 'sso'
          })
          this.responsesSrvc.remove(res._id)
        } catch (error) {
          this.$q.notify({
            message: 'Wrong Password',
            position: 'bottom',
            color: 'negative'
          })
        }
      })
    }
  }
}
</script>
