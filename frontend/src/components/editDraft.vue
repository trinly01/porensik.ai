<template>
  <q-card style="min-width: 80vw">
    <q-card-section class="row">
      <div class="text-h6 col">Edit Draft</div>
      <div>
        <q-btn dense round icon="close" v-close-popup />
      </div>
    </q-card-section>
    <q-card-section class="col">
      <div class="row">
        <div class="col">
          <div class="row q-gutter-md">
            <q-input v-model="revision.code" label="Code" autofocus
            class="col-xs-11 col-sm-11 col-md col-lg col-xl-4" />
            <q-input v-model="revision.previousVersion" label="Previous version" />
            <q-input v-model="revision.version" label="New version" />
          </div>
          <div class="row q-gutter-md">
            <q-input
            class="col-xs-11 col-sm-11 col-md col-lg col-xl-4"
            v-model="revision.title" label="Title" />
            <q-input
            style="position: relative; top: 10px;"
            label="Effectivity Date"
            v-model="revision.effectivityDate"
            mask="date"
            :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="revision.effectivityDate" @input="() => $refs.qDateProxy.hide()" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </div>
      <div class="col q-pt-md q-gutter-md">
        <div>Reason</div>
        <q-editor v-model="revision.reason" min-height="5rem" :toolbar="toolbar" :fonts="fonts" />
        <div>Details</div>
        <q-editor v-model="revision.details" min-height="5rem" :toolbar="toolbar" :fonts="fonts" />
      </div>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          :disabled="(
            !revision.reason ||
            !revision.details ||
            !revision.version
          )"
          color="primary"
          label="Submit"
          @click="submit" />
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: [ 'draftDialog', 'node', 'vi' ],
  mounted () {
    this.$nextTick(() => {
      this.draftUploader = this.$refs.draftUploader
      console.log('mounted this.draftUploader', this.draftUploader)
    })
    // console.log('this.$refs.draftUploader', this.$refs.draftUploader)
  },
  data: function () {
    // let currentVersion = this.currentVersion(this.node)

    return ({
      file: this.node,
      draftUploader: { files: [] },
      jwt: window.localStorage.getItem(`${this.$dbCon.io.io.uri}-jwt`),
      revision: {
        effectivityDate: this.node.versions[this.vi].effectivityDate,
        code: this.node.versions[this.vi].code,
        title: this.node.versions[this.vi].title,
        previousVersion: this.node.versions[this.vi].previousVersion,
        version: this.node.versions[this.vi].version,
        reason: this.node.versions[this.vi].reason,
        details: this.node.versions[this.vi].details,
        initiator: this.node.versions[this.vi].initiator,
        approved: this.node.versions[this.vi].approved
      },
      toolbar: [
        ['left', 'center', 'right', 'justify'],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr', 'link', 'custom_btn'],
        [
          {
            label: this.$q.lang.editor.formatting,
            icon: this.$q.iconSet.editor.formatting,
            list: 'no-icons',
            options: [
              'p',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'code'
            ]
          },
          {
            label: this.$q.lang.editor.fontSize,
            icon: this.$q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7'
            ]
          },
          {
            label: this.$q.lang.editor.defaultFont,
            icon: this.$q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'default_font',
              'arial',
              'arial_black',
              'comic_sans',
              'courier_new',
              'impact',
              'lucida_grande',
              'times_new_roman',
              'verdana'
            ]
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        ['undo', 'redo'],
        ['print', 'fullscreen']
      ],
      fonts: {
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      }
    })
  },
  methods: {
    close () {
      console.log('this.draftDialog', this.draftDialog)
      this.draftDialog[0].hide()
    },
    submit () {
      this.$q.loading.show({
        message: `Submitting Draft ${this.revision.version}`
      })
      // console.log('this.$refs.draftUploader', this.$refs.draftUploader)
      // if (this.draftUploader.files.length) {
      //   this.$refs.draftUploader.upload()
      // } else {
      //   this.patch()
      // }
      this.patch()
    },
    async uploaded (info) {
      console.log('UPLOADED')
      try {
        // let timestamp = Date.now()
        // let label = info.files[0].name
        let file = JSON.parse(info.xhr.response)
        file = Object.assign(file, this.revision)
        file.effectivityDate = (new Date(this.revision.effectivityDate)).getTime()
        file.dateUploaded = (new Date()).getTime()
        file.approvers = this.$lodash.cloneDeep(this.node.security.approvers)
        this.$dbCon.service('uploads').patch(file._id, {
          parentNode: this.node._id
        })
        // let versions = this.$lodash.cloneDeep(this.node.versions)
        // versions.unshift(file)
        console.log('file', file)
        this.patch(file)
      } catch (error) {
        this.$q.notify({
          message: error.toString(),
          position: 'bottom-right',
          color: 'negative'
        })
      }

      this.$q.loading.hide()
    },
    async patch (file = {}) {
      let patch = {}
      let rev = {}
      Object.assign(rev, file)
      Object.assign(rev, this.revision)
      rev.approvers = this.$lodash.cloneDeep(this.node.security.approvers)
      patch[`versions.${this.vi}`] = rev

      let tempRev = this.node.versions[this.vi]

      let log = {
        action: 'Change Request Update',
        timestamp: Date.now(),
        data: {
          new: this.$deepDiff(tempRev, rev),
          old: this.$deepDiff(rev, tempRev)
        },
        user: this.$root.user
      }
      patch['logs'] = this.node.logs.concat([log])

      await this.$dbCon.services['juan-files'].patch(this.node._id, patch)
      if (this.node.security.approvers) {
        this.node.security.approvers.map(async user => {
          let url = ''
          if (this.node.isFolder) {
            url = this.$host + '/#/myDrive/' + this.node._id
          } else {
            url = this.$host + '/#/myDrive/' + this.node.parentFolder + '?f=' + this.node._id
          }
          this.$axios.post(`${this.$dbCon.io.io.uri}/sendMail`, {
            to: user.value.personal_information.email,
            subject: `OnlineISO: ${this.node.label}`,
            message: `
              ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
              edited a change request
              <a href="${url}">${this.node.label}</a> ${this.node.isFolder ? 'folder' : 'file'}
            `,
            url: `${url}`,
            html: {
              firstName: user.value.personal_information.first_name,
              message: `
                ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
                notified you to sign the Change Request
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
            to: user.value,
            action: 'edited a draft',
            access: 'revision',
            data: this.node,
            timestamp: Date.now(),
            seen: false
          })
        })
      }
      this.draftDialog[0].hide()
      this.$q.notify({
        message: 'Change request was edited',
        position: 'bottom-right',
        color: 'positive'
      })
      this.$q.loading.hide()
    },
    currentVersion (file) {
      let index = null
      if (typeof file.versions[0].approved === 'undefined') {
        index = 0
      } else if (file.versions[0].approved) {
        index = 0
      } else {
        index = 1
      }
      return file.versions[index]
    },
    open (_id) {
      window.open(`${this.$dbCon.io.io.uri}/uploads?_id=${_id}`, '_blank')
    }
  }
}
</script>
