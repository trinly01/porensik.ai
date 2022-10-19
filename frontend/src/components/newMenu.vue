<template>
  <q-menu
    v-if="
      !newFolderPrompt &&
      !newUploadPrompt &&
      !newFormPrompt &&
      !newDocPrompt
    "
    ref="newMenu"
    touch-position
    :context-menu="leftClick ? false: true"
    auto-close
    @drop.prevent
  >
    <q-list dense style="min-width: 200px">
      <!-- <q-item clickable v-close-popup>
        <q-item-section>New Folder</q-item-section>
      </q-item> -->
      <q-item clickable v-ripple @click="newFolder">
        <q-item-section avatar>
          <q-icon color="blue-grey" name="create_new_folder" />
        </q-item-section>

        <q-item-section>New Folder</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="newFile">
        <q-item-section avatar>
          <q-icon size="20px" color="blue-grey" name="fas fa-file-upload" style="left: 1px" />
        </q-item-section>
        <q-item-section>Upload File</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-ripple @click="showNewDoc">
        <q-item-section avatar>
          <q-icon size="20px" color="blue" name="fas fa-file-alt" style="left: 1px" />
        </q-item-section>
        <q-item-section>New Doc (Phase 2)</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="showNewForm">
        <q-item-section avatar>
          <q-icon size="20px" color="purple" name="fas fa-file-signature" style="left: 5px" />
        </q-item-section>
        <q-item-section>New Form (Phase 2)</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
  <q-dialog ref="newFormPrompt" v-else-if="newFormPrompt" v-model="newFormPrompt" persistent>
    <juan-form :refs="$refs"></juan-form>
  </q-dialog>
  <q-dialog ref="newDocPrompt" v-else-if="newDocPrompt" v-model="newDocPrompt" persistent>
    <new-doc :refs="$refs"></new-doc>
  </q-dialog>
  <q-dialog v-else-if="newFolderPrompt" v-model="newFolderPrompt" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">New folder</div>
      </q-card-section>

      <q-card-section>
        <q-input dense v-model="folderName" autofocus @keyup.enter="saveFolder" @focus="$event.target.select()" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn color="primary" label="Create" @click="saveFolder" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-else @drop.prevent v-model="newUploadPrompt" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="row">
        <div class="text-h6 col">Upload</div>
        <q-btn dense round icon="close" v-close-popup @click="$refs.uploader.reset()"></q-btn>
      </q-card-section>

      <q-card-section class="row">
          <q-uploader
            ref="qUpload"
            multiple
            class="col no-shadow"
            :headers="[{ name: 'Authorization', value: $root.jwt}]"
            :url="$dbCon.io.io.uri + '/uploads'"
            field-name="file"
            @uploaded="uploaded"
          />
      </q-card-section>

      <!-- <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn color="primary" label="Save" @click="saveFolder" />
      </q-card-actions> -->
    </q-card>
  </q-dialog>
</template>

<script>
import juanForm from 'components/juanForm.vue'
import newDoc from 'components/newDoc.vue'
export default {
  components: { juanForm, newDoc },
  props: [ 'leftClick' ],
  data: function () {
    return ({
      jwt: process.env.CLIENT ? window.localStorage.getItem(`${this.$dbCon.io.io.uri}-jwt`) : '',
      newFolderPrompt: false,
      newUploadPrompt: false,
      newFormPrompt: false,
      newDocPrompt: false,
      folderName: 'Untitled folder'
    })
  },
  methods: {
    async uploaded (info) {
      console.log('uploaded', info)
      console.log('pogiUpload', this.$refs.qUpload)
      let timestamp = Date.now()
      let label = info.files[0].name
      let file = JSON.parse(info.xhr.response)
      file.version = '0'
      // console.log('info.xhr.response', info.xhr.response)
      let data = await this.$dbCon.services['juan-files'].create({
        label,
        versions: [ file ],
        parentFolder: this.$root.currentFolder._id,
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
      console.log('file uploaded timi', file)
      this.$dbCon.service('uploads').patch(file._id, {
        parentNode: data._id
      })
      this.$q.notify({
        message: label + ' was uploaded',
        position: 'bottom-right',
        color: 'positive'
      })
      if (this.newUploadPrompt && this.$refs.qUpload.files.length === this.$refs.qUpload.uploadedFiles.length) {
        this.newUploadPrompt = false
        this.newFolderPrompt = false
      }
    },
    newFolder () {
      this.newFolderPrompt = true
      this.folderName = 'Untitled folder'
      this.$refs.newMenu.toggle()
    },
    newFile () {
      this.newUploadPrompt = true
      this.newFolderPrompt = false
      this.newFormPrompt = false
      console.log('labas upload')
      this.$refs.newMenu.toggle()
    },
    showNewForm () {
      this.newFormPrompt = true
      this.newDocPrompt = false
      this.newUploadPrompt = false
      this.newFolderPrompt = false
      this.$refs.newMenu.toggle()
    },
    showNewDoc () {
      this.newDocPrompt = true
      this.newFormPrompt = false
      this.newUploadPrompt = false
      this.newFolderPrompt = false
      this.$refs.newMenu.toggle()
    },
    async saveFolder () {
      const timestamp = Date.now()
      await this.$dbCon.services['juan-folders'].create({
        label: this.folderName,
        parentFolder: this.$root.currentFolder._id,
        isFolder: true,
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
      this.newFolderPrompt = false
    }
  }
}
</script>
