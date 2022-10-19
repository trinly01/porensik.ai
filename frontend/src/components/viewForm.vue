<style scoped>
</style>
<template>
  <q-layout class="bg-white text-black" container style="min-width: 80vw;">
    <q-header class="bg-white text-black shadow-up-1">
      <q-toolbar class="">
        <q-btn flat round dense icon="fas fa-file-signature" color="purple" />
        <q-toolbar-title>{{ node.label }}</q-toolbar-title>
        <q-btn flat v-close-popup round dense icon="close" />
      </q-toolbar>
    </q-header>
    <q-page-container class="q-pa-lg col" ref='printable'>
      <!-- <input type="radio" name="gender" value="male"> Male<br>
      <input type="radio" name="gender" value="female"> Female<br>
      <input type="radio" name="gender" value="other"> Other -->
      <q-form ref='qForm'>
        <div class="q-pt-md q-ma-md" v-html="node.details"></div>
        <q-separator />
        <!-- {{node.layout ? node.layout : '' }} -->
        <span class="q-ma-md" v-if="node.layout" v-html="node.layout"></span>
        <div v-else class="col">
          <div class="col q-ma-md" v-for="(que, qi) in format" :key="'que-'+ qi">
            <!-- {{que.value}} -->
            <juan-input
              :updateResponse="() => {
                if (response && response.userID) {
                  notifyOwnerItWasSigned()
                  updateResponse()
                }
              }"
              v-model="que.value" :query="que" :qi="qi" :node="node" :response="response" :hasResponse="hasResponse" :format="format"></juan-input>
            <!-- <pre v-if="que.type.value === 'Select'">{{que.options}}</pre> -->
          </div>
        </div>
        <!-- <pre>
          {{ format }}
        </pre> -->
      </q-form>
      <div class="row">
        <!-- <pre class="col">A {{node.format.map(q => q.value)}}</pre> -->
        <!-- <pre class=" col">B {{ vueJuanInputs.map(f => f.que.value) }}</pre> -->
        <!-- <pre class=" col">B {{ format.map(f => f.value) }}</pre> -->
      </div>
    </q-page-container>
    <q-footer>
      <q-toolbar class="bg-white text-black shadow-1">
        <q-btn
          round
          size="md"
          flat
          color="purple"
          icon="print"
          @click="$lodash.printElem($refs.printable.$el)" />
        <q-btn
          v-if="node.multipleResponse"
          flat
          color="purple"
          label="view your responses"
          @click="responsesPrompt = true"
        >
          <q-dialog v-if="responsesPrompt" v-model="responsesPrompt" persistent>
            <juan-responses :node="node" :userID="$root.user._id" ></juan-responses>
          </q-dialog>
        </q-btn>
        <q-toolbar-title></q-toolbar-title>
        <q-btn flat label="Cancel" v-close-popup />
        <!-- a{{format}} -->
        <!-- b{{vueJuanInputs.map(q => q.que)}} -->
        <!-- c{{!$lodash.isEmpty($deepDiff(vueJuanInputs.map(q => q.que.value), format.map(f => f.value)))}} -->
        <!-- asd{{ format.map(f => f.value) }} -->
        <!-- {{ vueJuanInputs.map(f => f.que.value) }} -->
        <!-- diff{{ $deepDiff(vueJuanInputs.map(f => f.que.value), node.format.map(q => q.value)) }} -->
        <q-btn
          v-if="response"
          :disabled="(!node.layout ? $lodash.isEmpty($deepDiff(node.format.map(q => q.value), format.map(q => q.value))) : $lodash.isEmpty($deepDiff(vueJuanInputs.map(q => q.que.value), format.map(f => f.value))))"
          color="purple"
          label="Update1"
          @click="updateResponse" />
        <q-btn
          v-else-if="node.multipleResponse || !hasResponse"
          color="purple"
          label="Submit"
          @click="submit" />
        <q-btn
          v-else
          :disabled="!node.multipleResponse && (!node.editableResponse && hasResponse) || (response && !node.editableResponse)"
          color="purple"
          label="Update"
          @click="updateResponse"
          />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
// import VueQr from 'vue-qr'
// import approveDialog from 'components/approveDialog.vue'
import juanInput from 'components/juanInput.vue'
// const { regex } = require('puzzy-search')
import juanResponses from 'components/juanResponses.vue'
export default {
  components: { juanInput, juanResponses },
  props: ['refs', 'node', 'response'],
  beforeDestroy () {
    this.responsesSrvc.destroy()
  },
  async mounted () {
    this.vueJuanInputs = []
    // this.node.format.map(q => { q.value = null })
    // const sentence = 'You want the web server to support four of the most popular programming paradigms.'
    // const str = 'puppular programmng paradim'
    // console.log('pogi pogi', sentence.match(regex(str)) !== null)
    this.responsesSrvc = this.$dbCon.wingsService('juan-responses')
    if (!this.node.multipleResponse) await this.andar()
    if (!this.response) {
      this.format.map((query, qi) => { query.value = '' })
    } else {
      console.log('Hello timi', this.format, this.node.format)
      Object.keys(this.response).map(k => {})
      this.format.map((q, ii) => {
        // console.log('', this.node.format[q.field])
        this.node.format[ii].value = q.value = ((q.type.value && q.type.value === 'Date')
          ? this.$moment(this.response[q.field]).format('YYYY/MM/DD')
          : this.response[q.field])
      })
    }
    if (this.node.layout) {
      console.log('HAS LAYOUT')
      this.format.map((query, qi) => {
        console.log('q', query)
        let el = document.querySelector('q' + qi)
        console.log(el)
        if (el) {
          console.log('this.$root', this.$root)
          if (this.responseFromDb) {
            query.value = this.$lodash.cloneDeep(this.responseFromDb[query.field])
          }
          let c = new this.$Vue({
            ...juanInput,
            propsData: {
              node: this.node,
              query: this.$lodash.cloneDeep(query),
              'v-model': this.responseFromDb ? this.$lodash.cloneDeep(this.responseFromDb[query.field]) : this.$lodash.cloneDeep(query.value),
              updateResponse: () => {
                if (this.response && this.response.userID) {
                  this.notifyOwnerItWasSigned()
                  this.updateResponse()
                }
              },
              qi,
              response: this.response,
              hasResponse: false,
              format: this.node.format,
              root: this.$root
            }
          })
          c.$root = this.$root
          c.$mount(el)
          this.vueJuanInputs.push(c)
          console.log('c', c)
        }
      })
    }
  },
  data () {
    return {
      vueJuanInputs: [],
      searchedUsers: [],
      format: this.$lodash.cloneDeep(this.node.format),
      responsesPrompt: false,
      hasResponse: false,
      buttonSubmit: null,
      buttonSave: null,
      responseID: null
    }
  },
  methods: {
    async andar () {
      let responses = await this.responsesSrvc.find({
        query: {
          formID: this.node._id,
          userID: this.$root.user._id
        }
      })
      if (responses.data.length) {
        this.responseFromDb = this.$lodash.cloneDeep(responses.data[0])
        if (!this.node.multipleResponse) { // single
          this.response = this.responseFromDb
          this.hasResponse = true
          this.format.map(q => {
            q.value = (q.type.value && q.type.value === 'Date')
              ? this.$moment(responses.data[0][q.field]).format('YYYY/MM/DD')
              : responses.data[0][q.field]
          })
        } else {
          this.format.map(q => {
            q.value = ''
          })
        }
      }
    },
    async notifyOwnerItWasSigned () {
      console.log('notifying', this.response)
      let owner = await this.$sso.services.users.get(this.response.userID)
      owner = this.$removePersonalInfo(owner)
      let url = ''
      if (this.node.isFolder) {
        url = this.$host + '/#/myDrive/' + this.node._id
      } else {
        url = this.$host + '/#/myDrive/' + this.node.parentFolder + '?f=' + this.node._id
      }
      this.$axios.post(`${this.$dbCon.io.io.uri}/sendMail`, {
        to: owner.personal_information.email,
        subject: `OnlineISO: ${this.response._id.substr(0, 3)} ${this.response._id.substr(-3, 3)} - ${this.node.label}`,
        message: `
          ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
          signed (${this.response._id.substr(0, 3)} ${this.response._id.substr(-3, 3)} - ${this.node.label})
          <a href="${url}">${this.node.label}</a> ${this.node.isFolder ? 'folder' : 'file'}
        `,
        url: `${url}`,
        html: {
          firstName: owner.personal_information.first_name,
          message: `
            ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
            signed (${this.response._id.substr(0, 3)} ${this.response._id.substr(-3, 3)} - ${this.node.label})
          `,
          url: {
            text: 'Open "' + this.node.label + '"',
            link: url
          }
        }
      }, {
        'Content-Type': 'application/json'
      })
      await this.$dbCon.services['juan-notifs'].create({
        from: this.$root.user,
        to: owner,
        action: `signed (${this.response._id.substr(0, 3)} ${this.response._id.substr(-3, 3)})`,
        access: 'signed',
        data: this.node,
        timestamp: Date.now(),
        seen: false
      })
    },
    async submit () {
      console.log('vueInputs', this.vueJuanInputs)
      let valid = false
      let juanData = {
        formID: this.node._id,
        userID: this.$root.user._id,
        dateSubmitted: Date.now()
      }

      if (this.node.layout) {
        let errors = this.vueJuanInputs.filter(f => {
          let que = f.que
          console.log('que', que.value)
          f.validate()
          if (que.type === 'Text' || ['Text', 'Number', 'Rating', 'Date', 'Time'].includes(que.type.value)) {
            return !(que.isRequired ? !!que.value : true)
          } else if (que.type.value === 'Select') {
            if (!que.isMultiple) {
              return !(que.isRequired && que.value ? !!que.value.value : true)
            }
            return !(que.isRequired ? (que.value !== null && !!que.value.length) : true)
          } else if (que.type.value === 'digiSign') {
            return !(que.isRequired ? (que.value.hash ? !!que.value.hash : false) : true)
          }
          return false
        })
        console.log('errors', errors)
        valid = !errors.length // if has errors make it true
      } else {
        console.log('form', this.$refs.qForm)
        valid = await this.$refs.qForm.validate()
      }
      if (valid) {
        this.format.map((f, ind) => {
          if (this.node.layout && this.vueJuanInputs[ind]) {
            let que = this.vueJuanInputs[ind].que
            console.log('asdasdas', que)
            if (['Date', 'Time'].includes(f.type.value)) {
              juanData[f.field] = (new Date(que.value)).getTime()
            } else {
              juanData[f.field] = que.value
            }
          } else {
            if (['Date', 'Time'].includes(f.type.value)) {
              juanData[f.field] = (new Date(f.value)).getTime()
            } else {
              juanData[f.field] = f.value
            }
          }
        })
        console.log('juanData', this.format)
        let dd = await this.responsesSrvc.create(juanData)
        this.hasResponse = true
        this.responseID = dd._id
        this.$q.notify({
          message: 'Response Submitted',
          position: 'bottom-right',
          color: 'positive'
        })
      }
    },
    async updateResponse () {
      let valid = false
      let timestamp = Date.now()
      let juanData = {}

      if (this.node.layout) {
        let errors = this.vueJuanInputs.filter(f => {
          let que = f.que
          console.log('que', que.value)
          f.validate()
          if (que.type === 'Text' || ['Text', 'Number', 'Rating', 'Date', 'Time'].includes(que.type.value)) {
            return !(que.isRequired ? !!que.value : true)
          } else if (que.type.value === 'Select') {
            if (!que.isMultiple) {
              return !(que.isRequired && que.value ? !!que.value.value : true)
            }
            return !(que.isRequired ? (que.value !== null && !!que.value.length) : true)
          } else if (que.type.value === 'digiSign') {
            return !(que.isRequired ? (que.value.hash ? !!que.value.hash : false) : true)
          }
          return false
        })
        console.log('errors', errors)
        valid = !errors.length // if has errors make it true
      } else {
        console.log('form', this.$refs.qForm)
        valid = await this.$refs.qForm.validate()
      }
      if (valid) {
        juanData = this.$lodash.cloneDeep(this.response || this.responseFromDb)
        this.format.map((f, ind) => {
          if (this.node.layout && this.vueJuanInputs[ind]) {
            let que = this.vueJuanInputs[ind].que
            console.log('asdasdas', que)
            if (f.type.value === 'Date') {
              juanData[f.field] = (new Date(que.value)).getTime()
            } else {
              juanData[f.field] = que.value
            }
          } else {
            if (f.type.value === 'Date') {
              juanData[f.field] = (new Date(f.value)).getTime()
            } else {
              juanData[f.field] = f.value
            }
          }
        })

        let log = {
          action: 'Modified',
          timestamp,
          data: {
            old: this.$deepDiff(this.response, juanData),
            new: this.$deepDiff(juanData, (this.response || this.responseFromDb))
          },
          user: this.$root.user
        }
        // this.form.logs.push(log)
        juanData.$push = {
          'logs': log
        }
        console.log('log', juanData)
        let dd = await this.responsesSrvc.patch(juanData._id, juanData)
        this.hasResponse = true
        this.responseID = dd._id
        this.$q.notify({
          message: 'Response Updatedd',
          position: 'bottom-right',
          color: 'positive'
        })
        // console.log('diff', this.format)
        this.node.format.map((q, i) => {
          if (q.value) {
            this.node.format[i].value = this.format[i].value = q.value = (q.type.value && q.type.value === 'Date')
              ? this.$moment(dd[q.field]).format('YYYY/MM/DD')
              : this.$lodash.cloneDeep(dd[q.field])
          }
        })

        // console.log('diff', this.$deepDiff(this.format.map(q => q.value), this.node.format.map(q => q.value)))
        // this.
      }
    },
    filterFn (val, update, que) {
      if (val === '') {
        update(() => {
          que.options = que.origOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        que.options = que.origOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    async searchUsers (val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }
      const result = await this.$sso.services.users.find({
        query: {
          $search: val
        }
      })

      console.log(result.data)

      update(() => {
        this.searchedUsers = result.data.map(u => {
          delete u.training_programs
          delete u.voluntary_work
          delete u.work_experience
          delete u.civil_service_eligibility
          delete u.educational_background
          delete u.family_background
          delete u.other_information
          delete u.extra_information.signature
          return {
            label: u.personal_information.first_name + ' ' + u.personal_information.surname,
            value: u
          }
        })
      })
    }
  }
}
</script>
