<template>
  <q-card style="min-width: 80vw">
    <q-card-section class="row">
      <div class="text-h6 col">Change Request</div>
      <div>
        <q-btn dense round icon="close" @click="close" />
      </div>
    </q-card-section>
    <q-card-section class="col">
      <div class="row">
        <!-- <q-uploader
          hide-upload-btn
          ref="draftUploader"
          class="col-xs-12 col-sm col-md-4 col-lg-4 col-xl-4 q-mr-md"
          :headers="[
            { name: 'Authorization', value: jwt}
          ]"
          :url="$dbCon.io.io.uri + '/uploads'"
          field-name="file"
          @uploaded="uploaded"
        /> -->
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
  props: [ 'draftDialog', 'node' ],
  mounted () {
    this.$nextTick(() => {
      this.draftUploader = this.$refs.draftUploader
    })
    // console.log('this.$refs.draftUploader', this.$refs.draftUploader)
  },
  data: function () {
    let currentVersion = this.currentVersion(this.node)
    console.log('currentVersion', currentVersion)
    let previousVersion = ''
    let version = ''
    if (typeof currentVersion.previousVersion !== 'undefined') {
      previousVersion = currentVersion.version
      let arrVersion = currentVersion.version.split('.')
      ++arrVersion[arrVersion.length - 1]
      version = arrVersion.join('.')
    } else if (typeof currentVersion.previousVersion === 'undefined') {
      previousVersion = currentVersion.version
      version = '0.0.0'
    }

    return ({
      draftUploader: { files: [] },
      jwt: window.localStorage.getItem(`${this.$dbCon.io.io.uri}-jwt`),
      revision: {
        effectivityDate: null,
        code: '',
        title: this.node.label,
        previousVersion,
        version,
        reason: '',
        details: '',
        initiator: this.$root.user._id,
        approved: false
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
      this.draftDialog.hide()
    },
    async submit () {
      this.$q.loading.show({
        message: `Submitting Draft ${this.revision.version}`
      })
      try {
        // let timestamp = Date.now()
        // let label = info.files[0].name
        let versions = this.$lodash.cloneDeep(this.node.versions)
        // let file = JSON.parse(info.xhr.response)
        let file = Object.assign({}, this.revision)
        file.effectivityDate = (new Date(this.revision.effectivityDate)).getTime()
        // file.dateUploaded = (new Date()).getTime()
        if (this.node.security.approvers) {
          file.approvers = this.$lodash.cloneDeep(this.node.security.approvers).map(u => {
            u.approved = false
            return u
          })
        }
        versions.unshift(this.$lodash.cloneDeep(file))
        // this.$dbCon.service('uploads').patch(file._id, {
        //   parentNode: this.node._id
        // })
        let logs = this.$lodash.cloneDeep(this.node.logs)
        let log = {
          action: 'Revision Requested',
          timestamp: Date.now(),
          data: file,
          user: this.$root.user
        }
        logs.push(log)
        await this.$dbCon.services['juan-files'].patch(this.node._id, {
          versions,
          logs
        })
        if (this.node.security.approvers) {
          file.approvers.map(async user => {
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
                requested a change request
                <a href="${url}">${this.node.label}</a> ${this.node.isFolder ? 'folder' : 'file'}
              `,
              url: `${url}`,
              html: {
                firstName: user.value.personal_information.first_name,
                message: `
                  ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
                  requested a change request
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
              action: 'Revision requested',
              access: 'revision',
              data: this.node,
              timestamp: Date.now(),
              seen: false
            })
          })
        }
        this.draftDialog.hide()
        this.$q.notify({
          message: 'Revision requested',
          position: 'bottom-right',
          color: 'positive'
        })
      } catch (error) {
        console.error(error)
        this.$q.notify({
          message: error.toString(),
          position: 'bottom-right',
          color: 'negative'
        })
      }

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
    }
  }
}
</script>
