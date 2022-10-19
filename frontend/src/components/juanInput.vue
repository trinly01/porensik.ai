<template>
          <div v-if="!que">none</div>
          <q-input filled v-else-if="que.type === 'Text' || que.type.value === 'Text'" v-model="que.value" :label="que.field" type="textarea" :rows="1"
            :ref="'que-'+qi" :rules="[
              val => (que.isRequired ? !!que.value : true) || 'Field is required'
            ]"
            clearable
            :readonly="(response && response.userID && $root.user._id !== response.userID && !editableByModifiers) || !node.multipleResponse && (!node.editableResponse && hasResponse) || (!$lodash.isEmpty(response) && !que.isEditable)"
          />
          <q-input filled v-else-if="que.type.value === 'Number'" v-model.number="que.value" :label="que.field" type="number"
            :ref="'que-'+qi" :rules="[
              val => (que.isRequired ? !!que.value : true) || 'Field is required'
            ]"
            clearable
            :readonly="(response && response.userID && $root.user._id !== response.userID && !editableByModifiers) || !node.multipleResponse && (!node.editableResponse && hasResponse) || (!$lodash.isEmpty(response) && !que.isEditable)"
          />
          <div v-else-if="que.type.value === 'Select'">
            <!-- {{ que.isMultiple }} -->
            {{ que.value === '' ? (que.value = [], (que.origOptions ? que.origOptions = $lodash.cloneDeep(que.options) : '') ) : '' }}
            <q-select filled v-if="!que.isMultiple" :ref="'que-'+qi" v-model="que.value" :options="que.options" :label="que.field" use-input
              @filter="(val, update) => filterFn(val, update, que)"
              @input="$log(qi), $refs['que-'+qi].hidePopup()"
              :rules="[
                val => (que.isRequired && que.value ? !!que.value.value : true) || 'Field is required'
              ]"
              clearable
              :readonly="(response && response.userID && $root.user._id !== response.userID && !editableByModifiers) || !node.multipleResponse && (!node.editableResponse && hasResponse) || (!$lodash.isEmpty(response) && !que.isEditable)"
            />
            <q-select filled v-else :ref="'que-'+qi" v-model="que.value" :options="que.options" :label="que.field" multiple use-chips stack-label use-input
              @filter="(val, update) => filterFn(val, update, que)"
              @input="$refs['que-'+qi].updateInputValue(''), $forceUpdate()"
              :rules="[
                val => (que.isRequired ? (que.value !== null && !!que.value.length) : true) || 'Field is required'
              ]"
              clearable
              :readonly="(response && response.userID && $root.user._id !== response.userID && !editableByModifiers) || !node.multipleResponse && (!node.editableResponse && hasResponse) || (!$lodash.isEmpty(response) && !que.isEditable)"
            />
          </div>
          <q-field v-else-if="que.type.value === 'Rating'" :value="que.value" :label="que.field" stack-label filled
            :ref="'que-'+qi" :rules="[
              val => (que.isRequired ? !!que.value : true) || 'Field is required'
            ]"
            lazy-rules
            :readonly="(response && response.userID && $root.user._id !== response.userID && !editableByModifiers) || !node.multipleResponse && (!node.editableResponse && hasResponse) || (!$lodash.isEmpty(response) && !que.isEditable)"
          >
            <template v-slot:control>
              {{ que.value === '' ? (que.value = 0 ) : '' }}
              <q-rating
                v-model.number="que.value"
                :max="que.max"
                size="3.5em"
                color="purple"
                icon="star_border"
                icon-selected="star"
                :readonly="(response && response.userID && $root.user._id !== response.userID && !editableByModifiers) || !node.multipleResponse && (!node.editableResponse && hasResponse) || (!$lodash.isEmpty(response) && !que.isEditable)"
              />
            </template>
          </q-field>
          <q-input
            filled
            v-else-if="que.type.value === 'Date'"
            :label="que.field"
            v-model="que.value"
            mask="date"
            hint="YYYY/MM/DD"
            :ref="'que-'+qi" :rules="[
              val => (que.isRequired ? !!que.value : true) || 'Field is required',
              v => (que.isRequired ? /^\d{4}\/\d{2}\/\d{2}$/.test(v) : true ) || 'Invalid Date'
            ]"
            clearable
            :readonly="(response && response.userID && $root.user._id !== response.userID && !editableByModifiers) || !node.multipleResponse && (!node.editableResponse && hasResponse) || (!$lodash.isEmpty(response) && !que.isEditable)"
          >
            <q-menu anchor="center middle" self="center middle" ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date
                :readonly="(response && response.userID && $root.user._id !== response.userID && !editableByModifiers) || !node.multipleResponse && (!node.editableResponse && hasResponse) || (!$lodash.isEmpty(response) && !que.isEditable)"
                v-model="que.value" @input="() => $refs.qDateProxy.hide()" />
            </q-menu>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
              </q-icon>
            </template>
          </q-input>
          <q-input v-else-if="que.type.value === 'Time'" filled v-model="que.value" :label="que.field" mask="##:## AA"
            :ref="'que-'+qi" :rules="[
              val => (que.isRequired ? !!que.value : true) || 'Field is required',
              v => /^([0-1]?\d|2[0-3]):[0-5]\d ([AaPp][Mm])$/.test(v) || 'Invalid Date'
            ]"
            hint="hh:mm A"
            clearable
            :readonly="(response && response.userID && $root.user._id !== response.userID && !editableByModifiers) || !node.multipleResponse && (!node.editableResponse && hasResponse) || (!$lodash.isEmpty(response) && !que.isEditable)"
          >
            <q-menu anchor="center middle" self="center middle" ref="qTimeProxy" transition-show="scale" transition-hide="scale">
              <q-time
                :readonly="(response && response.userID && $root.user._id !== response.userID && !editableByModifiers) || !node.multipleResponse && (!node.editableResponse && hasResponse) || (!$lodash.isEmpty(response) && !que.isEditable)"
                v-model="que.value" @input="() => $refs.qTimeProxy.hide()" mask="hh:mm A" />
            </q-menu>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
              </q-icon>
            </template>
          </q-input>
          <q-field v-else-if="que.type.value === 'digiSign'" v-model="que.value" :label="que.field" stack-label filled
            :ref="'que-'+qi" :rules="[
              val => (que.isRequired ? (que.value.hash? !!que.value.hash : false) : true) || 'Field is required'
            ]"
            lazy-rules
            :disabled="!node.multipleResponse && (!$lodash.isEmpty(response) && !que.isEditable) && !que.value.assignedTo || (que.value.assignedTo && que.value.assignedTo.value && que.value.assignedTo.value._id !== $root.user._id) || (!node.editableResponse && que.value.hash)"
          >
            <template v-slot:control class="col">
              <!-- {{$root.user._id}} -->
              <div class="col">
                <div class="row justify-center">
                  <span v-show="false">
                    {{ que.value = que.value || {assignedTo: ''} }}
                  </span>
                  <!-- {{ que }} -->
                  <q-select
                    v-if="!que.value.hash"
                    :readonly="(response && response.userID&& $root.user._id !== response.userID)"
                    class="print-hide"
                    v-model="que.value.assignedTo"
                    :options="searchedUsers"
                    label="Signer"
                    use-input
                    ref="assignedTo"
                    @input="() => $refs.assignedTo.updateInputValue('')"
                    @filter="searchUsers"
                  >
                    <template v-if="que.value.assignedTo && !que.value.hash" v-slot:prepend>
                      <!-- <q-icon name="access_time" class="cursor-pointer">
                      </q-icon> -->

                      <q-btn @click="notifySigner(que.value.assignedTo)" color="purple" icon="notifications" round>
                        <q-tooltip>
                          Notify {{ que.value.assignedTo.label }}
                        </q-tooltip>
                      </q-btn>
                    </template>
                  </q-select>
                  <q-btn
                    :disabled="!node.multipleResponse && (!$lodash.isEmpty(response) && !que.isEditable) && !que.value.assignedTo || (que.value.assignedTo && que.value.assignedTo.value && que.value.assignedTo.value._id !== $root.user._id) || (!node.editableResponse && que.value.hash)"
                    class="self-center"
                    style="height: 70px;"
                    icon="fas fa-signature"
                    color="purple">
                    &nbsp; &nbsp;
                    <span v-if="que.value !== null && que.value.displayName">
                      {{ que.value.displayName }}
                      <br>
                      {{ $moment(que.value.datetime).format('lll') }}
                    </span>
                    <span v-else>Sign</span>
                    <approve-dialog :signHandler="((d) => { if(d) sign(que) })"/>
                  </q-btn>
                  <vue-qr v-if="que.value !== null && que.value.datetime" :text="que.value.hash" :size="100" :margin="8"></vue-qr>
                </div>
              </div>
            </template>
            <template v-if="(que.value.assignedTo || (response && response.userID && $root.user._id === response.userID)) && (node.editableResponse || que.isEditable)" v-slot:append>
              <q-icon name="cancel" class="cursor-pointer"
                @click="que.value = {assignedTo: ''}"
              >
              </q-icon>
            </template>
          </q-field>
</template>

<script>
import VueQr from 'vue-qr'
// let VueQr = process.env.CLIENT ? require('vue-qr') : {}
import approveDialog from 'components/approveDialog.vue'
export default {
  components: { approveDialog, VueQr },
  computed: {
    editableByModifiers () {
      return this.$lodash.findIndex(this.node.security.modifiers, user => {
        // console.log(user.value._id, this.$root.user._id)
        return user.value._id === this.$root.user._id
      }) > -1
    }
  },
  data: () => ({
    que: false,
    searchedUsers: []
  }),
  props: ['value', 'updateResponse', 'query', 'qi', 'node', 'response', 'hasResponse', 'format'],
  mounted () {
    this.que = this.query
  },
  watch: {
    'que.value' () {
      console.log('changedd')
      // this.$emit('value', this.que.value)
    }
  },
  methods: {
    validate () {
      console.log('Validateing')
      console.log('asd', this.$refs)
      return this.$refs['que-' + this.qi] && this.$refs['que-' + this.qi].validate ? this.$refs['que-' + this.qi].validate() : true
    },
    async notifySigner (signer) {
      let url = this.$host + '/#/myDrive/' + this.node.parentFolder + '?f=' + this.node._id
      this.$axios.post(`${this.$dbCon.io.io.uri}/sendMail`, {
        to: signer.value.personal_information.email,
        subject: `OnlineISO: ${this.node.label}`,
        message: `
          ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
          notified you to sign
          <i><a href="${url}">${this.node.label}</a></i> response
        `,
        url: `${url}`,
        html: {
          firstName: signer.value.personal_information.first_name,
          message: `
            ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
            notified you to sign (${this.node.label})
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
        to: signer.value,
        action: 'notified you to sign',
        access: 'formNotification',
        data: this.node,
        timestamp: Date.now(),
        seen: false
      })
      this.$q.notify({
        message: signer.label + ' was notified',
        position: 'bottom',
        color: 'purple',
        actions: [{ icon: 'close', color: 'white', round: true }]
      })
    },
    sign (que) {
      let juanData = {}
      this.format.filter(f => {
        return (f.type.value && f.type.value !== 'digiSign')
      }).map(f => {
        juanData[f.field] = f.value
      })
      console.log(juanData)
      let datetime = Date.now()
      que.value = {
        assignedTo: que.value.assignedTo,
        datetime,
        userId: this.$root.user._id,
        email: this.$root.user.personal_information.email,
        displayName: `${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}`,
        hash: this.$lodash.md5(juanData.toString() + datetime + this.$root.user._id)
      }
      console.log(que.value)
      if (this.response && this.response._id) {
        this.updateResponse()
      }
    },
    filterFn (val, update, que) {
      if (!que.origOptions) que.origOptions = this.$lodash.cloneDeep(que.options)
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
