<template>
  <q-layout class="bg-white text-black" container style="min-width: 80vw;">
    <q-header class="bg-white text-black shadow-up-1">
      <q-toolbar class="">
        <q-btn flat round dense icon="fas fa-file-signature" color="purple" />
        <q-toolbar-title>{{ value ? value.label : 'New Form' }}</q-toolbar-title>
        <q-btn flat v-close-popup round dense icon="close" />
      </q-toolbar>
    </q-header>
    <q-page-container class="q-pa-md col">
      <form-editor v-model="form"></form-editor>
    </q-page-container>
    <q-footer>
      <q-toolbar class="bg-white text-black shadow-1">
        <q-btn @click="$refs.formLayout.show()" color="purple" icon="view_quilt" label="Layout" />
        <form-layout ref="formLayout" v-model="form" />
        <q-toolbar-title></q-toolbar-title>
        <div class="q-pa-sm text-orange">
          {{ duplicateFields.length ? `Duplicate keys: [ ${duplicateFields.join(', ')} ]` : '' }}
        </div>
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          v-if="value"
          color="purple"
          label="Save"
          :disabled="$lodash.isEmpty($deepDiff(value, form))"
          @click="save" />
        <q-btn
          v-else
          color="purple"
          label="Create"
          @click="create" />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import formEditor from 'components/formEditor.vue'
import formLayout from 'components/formLayout.vue'
export default {
  components: { formEditor, formLayout },
  props: ['refs', 'value'],
  mounted () {
    if (this.value) {
      this.form = this.$lodash.cloneDeep(this.value)
    }
  },
  data () {
    return {
      form: {
        label: '',
        // versions: [ file ],
        details: '',
        parentFolder: this.$root.currentFolder._id,
        type: 'form',
        editableResponse: false,
        multipleResponse: false,
        format: [],
        isFolder: false,
        timestamps: {
          created: 'timestamp',
          modified: 'timestamp'
        },
        owner: this.$root.user._id,
        security: {
          public: false,
          viewers: [],
          uploaders: [],
          modifiers: [],
          removers: [],
          folderCreators: []
        },
        logs: [
          {
            action: 'created',
            timestamp: 'timestamp',
            user: this.$root.user
          }
        ]
      }
    }
  },
  computed: {
    duplicateFields () {
      return this.getDuplicates(this.form.format, 'field')
    }
  },
  methods: {
    getDuplicates (a, k) {
      return this.$lodash.filter(
        this.$lodash.uniq(
          this.$lodash.map(a, (item) => {
            // let o = {}
            // o[k] = item[k]
            if (this.$lodash.filter(a, [k, item[k]]).length > 1) {
              console.log(item, 'asd')
              return item[k]
            }
            return false
          })
        ),
        function (value) { return value }
      )
    },
    async create () {
      let timestamp = Date.now()
      this.form.timestamps.created = timestamp
      this.form.timestamps.modified = timestamp
      this.form.logs[0].timestamp = timestamp
      console.log(this.form)
      let data = await this.$dbCon.services['juan-files'].create(this.form)
      this.$root.clickedItem = data
      this.$q.notify({
        message: this.form.label + ' was created',
        position: 'bottom-right',
        color: 'positive'
      })
      this.refs.newFormPrompt.hide()
    },
    async save () {
      let log = {
        action: 'Modified',
        timestamp: Date.now(),
        data: {
          old: this.$deepDiff(this.value, this.form),
          new: this.$deepDiff(this.form, this.value)
        },
        user: this.$root.user
      }
      // this.form.logs.push(log)
      let data = await this.$dbCon.services['juan-files'].patch(this.form._id, {
        ...this.form,
        $push: {
          'logs': log
        }
      })
      this.$root.clickedItem = data
      this.form = data
      this.$q.notify({
        message: this.value.label + ' was modified',
        position: 'bottom-right',
        color: 'positive'
      })
      this.$emit('input', this.$lodash.cloneDeep(data))
      console.log(this.form.logs)
      // this.refs.newFormPrompt.hide()
    }
  }
}
</script>
