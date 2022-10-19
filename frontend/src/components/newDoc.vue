<style>
.absolute-full > .scroll,
.scroll > .q-layout--containerized {
  height: calc(100% - 50px);
}
.q-page-container {
  height: 100%
}
</style>
<template>
  <q-layout class="bg-white text-black" container style="min-width: 80vw;">
    <q-header class="bg-white text-black shadow-up-1">
      <q-toolbar class="">
        <q-btn flat round dense icon="fas fa-file-alt" color="blue" />
        <q-toolbar-title v-if="view">{{ view.label }}</q-toolbar-title>
        <q-toolbar-title v-else-if="modify">{{ modify.label }}</q-toolbar-title>
        <q-toolbar-title v-else> New Doc </q-toolbar-title>
        <q-btn flat v-close-popup round dense icon="close" />
      </q-toolbar>
    </q-header>
    <q-page-container class="q-pa-md">
      <div class="row q-pb-md items-end">
        <q-input v-if="!view" class="col" v-model="label" label="Title" />
        <q-input v-if="!view" v-model="version" label="Version" />
      </div>
      <!-- <q-editor v-model="details" min-height="5rem" :toolbar="toolbar" :fonts="fonts" /> -->
      <!-- <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor> -->
      <!-- <div class="row ql-toolbar ql-snow" style="border: 1px solid #ccc; border-bottom: none;">
        <q-btn size="sm" flat round icon="fas fa-table"
          @click="() => {
            $refs.wysiwyg.insertTable()
          }"
        />
      </div> -->
      <!-- <pre>{{view}}</pre> -->
      <wysiwyg ref="wysiwyg" v-model="content" :view="!!view"></wysiwyg>
      <div v-if="view && view.versions && approvers">
        <div class="q-pt-xl">
          Approvers
          <!-- <pre>{{view}}</pre> -->
        </div>
        <div class="row q-pa-md q-gutter-xl">
          <div
            style=""
            v-for="(u, i) in approvers" :key="'approvers' + i">
            <div class="row q-pt-md q-gutter-md">
              <div>
                <vue-qr :text="`${u.value._id}.${u.timestamp}`" :size="72" :margin="0"></vue-qr>
              </div>
              <div class="col">
                <div>{{ u.label }}</div>
                <!-- <div v-if="u.file.dateUploaded" class="text-caption text-grey">{{ $moment(u.file.dateUploaded).format('lll') }}</div> -->
                <!-- <pre>{{ node.versions[vi].initiator }}</pre>
                <pre>{{ $root.user._id }}</pre> -->
                <q-chip dense>
                  <q-avatar icon="thumb_up" color="green" text-color="white" />
                  {{ $moment(u.timestamp).format('lll') }}
                </q-chip>
              </div>
              <!-- asd -->
            </div>
          </div>
        </div>
      </div>
    </q-page-container>
    <q-footer>
      <q-toolbar class="bg-white text-black shadow-1">
        <q-btn
          v-if="!modify"
          round
          size="md"
          flat
          color="primary"
          icon="print"
          @click="$lodash.printElem($refs.wysiwyg.$el)" />
        <q-btn
          v-if="
            (
              modify
            )"
          color="orange-14"
          label="Difference"
          :disabled="content === modify.content && label === modify.label"
          @click="$refs.docDiff.show()"
        />
        <doc-diff
          v-if="
            (
              modify
            )"
          ref="docDiff"
          :update="{ content, label, version }"
          :old="(() => {
            if (modify) {
              return {
                content: modify.content,
                label: modify.label,
                version: modify.version
              }
            }
          })()"
        />
        <q-toolbar-title></q-toolbar-title>
        <q-btn v-if="modify || !view" flat label="Cancel" v-close-popup />
        <q-btn
          v-if="!view && !modify"
          :disabled="!label || !content"
          color="primary"
          label="Save"
          @click="create" />
        <!-- NO Approvers -->
        <q-btn
          v-if="
            modify
            && modify.security.approvers
            && !modify.security.approvers.length
          "
          :disabled="
            !label || !content
            || (modify.draft ? (label === modify.draft.label && content === modify.draft.content && version === modify.draft.version)
            : (label === modify.label && content === modify.content && (modify.versions ? version === modify.versions[modify.versions.length - 1].version : modify.version)))
          "
          color="primary"
          label="Save"
          @click="update"/>
        <!-- has Approvers -->
        <q-btn
          v-else-if="modify"
          :disabled="!label || !content
          || modify.draft ? (label === modify.draft.label || content === modify.draft.content || version === modify.draft.version)
          : (label === modify.label && content === modify.content || version === modify.version)"
          color="primary"
          label="Save Draft"
          @click="saveDraft" />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import VueQr from 'vue-qr'
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import wysiwyg from './wysiwyg.vue'
// let wysiwyg = !process.env.SERVER ? require('./wysiwyg.vue') : {template}
// import newForm from './newForm.vue'
// let formData = newForm.data
// console.log('newForm', formData)
import docDiff from './docDiff.vue'

export default {
  components: { wysiwyg, docDiff, VueQr },
  props: ['refs', 'view', 'modify', 'versions'],
  computed: {
    approvers () {
      let version = this.view.versions[this.view.versions.length - 1]
      let approvers = version.approvers
      if (approvers.filter(u => u.approved).length === approvers.length) {
        approvers.version = version
        console.log(approvers)
        return approvers
      } else if (this.view.versions) {
        let prevVersion = this.view.versions[this.view.versions.length - 2]
        let a2 = prevVersion.approvers
        if (a2.filter(u => u.approved).length === a2.length) {
          a2.version = prevVersion
          return a2
        }
      }
      return false
    }
  },
  created () {
    if (this.view) {
      this.content = this.view.content
      this.label = this.view.label
      this.draft = this.view.draft
      let ver = this.view.version || 'xxx'
      ver = this.view.versions ? this.view.versions[this.view.versions.length - 1].version : ver
      this.version = this.view.draft ? this.view.draft.version : ver
    } else if (this.modify) {
      this.content = this.modify.draft ? this.modify.draft.content : this.modify.content
      this.label = this.modify.draft ? this.modify.draft.label : this.modify.label
      // console.log('modifying', this.content)
      this.draft = this.modify.draft
      let ver = this.modify.version || 'xxx'
      ver = this.modify.versions ? this.modify.versions[this.modify.versions.length - 1].version : ver
      this.version = this.modify.draft ? this.modify.draft.version : ver
      // this.$forceUpdate()
    }
  },
  methods: {
    async create () {
      let timestamp = Date.now()
      let data = await this.$dbCon.services['juan-files'].create({
        label: this.label,
        content: this.content,
        version: this.version,
        parentFolder: this.$root.currentFolder._id,
        type: 'doc',
        isFolder: false,
        timestamps: {
          created: timestamp,
          modified: timestamp
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
            timestamp,
            user: this.$root.user
          }
        ]
      })
      this.$root.clickedItem = data
      this.$q.notify({
        message: this.label + ' was created',
        position: 'bottom-right',
        color: 'positive'
      })
      this.refs.newDocPrompt.hide()
    },
    async update () {
      let v = {
        label: this.label,
        content: this.content,
        version: this.version,
        dateUploaded: Date.now(),
        approved: true
      }
      let log = {
        action: 'New Version',
        timestamp: Date.now(),
        user: this.$root.user
      }
      // patch['logs'] = this.node.logs.concat([log])

      let versions = this.modify.versions || [v]
      if (this.modify.versions) {
        versions.push(v)
      }
      this.$q.notify({
        message: `Version ${this.version} published`,
        position: 'bottom-right',
        color: 'positive'
      })

      await this.$dbCon.services['juan-files'].patch(this.modify._id, {
        label: this.label,
        content: this.content,
        $push: {
          logs: log
        },
        versions
      })
    },
    async saveDraft () {
      let draft = {
        version: this.version,
        label: this.label,
        content: this.content,
        dateUploaded: Date.now(),
        approvers: this.$lodash.cloneDeep(this.modify.security.approvers)
      }
      await this.$dbCon.services['juan-files'].patch(this.modify._id, {
        draft
      })
      console.log(this.modify.draft)
      this.$q.notify({
        message: this.label + ' draft saved',
        position: 'bottom-right',
        color: 'positive'
      })
    }
  },
  data () {
    return {
      version: 'xxx',
      selected: null,
      hover: null,
      opthover: null,
      label: '',
      content: '',
      // editor: ClassicEditor,
      editorData: '<p>Content of the editor.</p>',
      editorConfig: {
        // The configuration of the editor.
      }
    }
  }
}
</script>
