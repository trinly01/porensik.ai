<template>
  <q-card style="min-width: 80vw">
    <q-card-section class="row">
      <div class="text-h6 col">Change Request {{ file.versions[vi].approved ? 'Published' : '' }}</div>
      <div>
        <q-btn dense round icon="close" v-close-popup />
      </div>
    </q-card-section>
    <q-card-section class="col">
      <div class="row">
        <div v-if="file.versions[vi].initiator === $root.user._id" class="col-xs-12 col-sm col-md-4 col-lg-4 col-xl-4 q-mr-md">
          <q-card :key="file.versions[vi]._id" v-if="file.versions[vi]._id" bordered class="no-shadow" >
            <div v-if="file.versions && $lodash.isImage(file.versions[vi].fileName)" class="thumbnail">
              <img :src="`${$dbCon.io.io.uri}/uploads?_id=${file.versions[vi]._id}`" class="portrait" alt="Image" />
            </div>
            <div v-else-if="$lodash.isVideo(file.versions[vi].fileName)" class="thumbnail">
              <video controls class="thumbnail" preload="none">
                <source :src="`${$dbCon.io.io.uri}/uploads?_id=${file.versions[vi]._id}` + `&direct=true` + '&t=' + $root.jwt">
                Your browser does not support the video tag.
              </video>
            </div>
            <div v-else class="row justify-center bg-blue-grey-1">
              <q-icon name="insert_drive_file" size="72px" color="blue-grey-14 thumbnail" class="q-pt-md q-pb-md" />
            </div>

            <q-card-section style="max-height: 56px;" class="row items-center no-wrap">
              <div class="col text-weight-regular limited-text" :class="{
                  'text-primary': $root.clickedItem._id === file._id,
                  'text-blue-grey-14': $root.clickedItem._id !== file._id
                }">
                <q-btn round flat class="bg-white q-mr-sm" color="blue-grey-14" size="sm" icon="insert_drive_file"></q-btn>
                <!-- <q-icon name="folder" class="q-pr-sm" /> -->
                <span>
                  {{ file.label }}
                  <q-tooltip v-if="file.label.length > 25">
                    {{ file.label }}
                  </q-tooltip>
                </span>
              </div>
              <!-- <div class="text-weight-light text-blue-grey-13">by John Doe</div> -->
              <div class="col-auto">
                  <q-btn @click="open(file.versions[vi]._id)" round icon="cloud_download" class="no-shadow text-grey-7" color="grey-11" size="sm" >
                    <!-- <node-menu :node="file"></node-menu> -->
                  </q-btn>
              </div>
            </q-card-section>
          </q-card>
          <div class="row" v-if="!file.versions[vi].approved && node.owner === $root.user._id">
            <q-uploader
              class="col"
              ref="draftUploader"
              :headers="[{ name: 'Authorization', value: jwt}]"
              :url="$dbCon.io.io.uri + '/uploads'"
              field-name="file"
              @uploaded="uploaded"
            />
          </div>
        </div>
        <div class="col">
          <div class="row q-gutter-md">
            <q-input v-model="revision.code" label="Code" autofocus readonly
            class="col-xs-11 col-sm-11 col-md col-lg col-xl-4" />
            <q-input v-model="revision.previousVersion" label="Previous version" readonly />
            <q-input v-model="revision.version" label="New version" readonly />
          </div>
          <div class="row q-gutter-md">
            <q-input
            readonly
            class="col-xs-11 col-sm-11 col-md col-lg col-xl-4"
            v-model="revision.title" label="Title" />
            <q-input
            readonly
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
      <div class="col q-pt-md q-pb-md q-gutter-md">
        <div>Reason</div>
        <q-editor v-model="revision.reason" min-height="5rem" :toolbar="[]" :fonts="fonts" readonly />
        <div>Details</div>
        <q-editor v-model="revision.details" min-height="5rem" :toolbar="[]" :fonts="fonts" readonly />
        <div>Approvers</div>
      </div>
        <div class="row q-gutter-md">
          <!-- {{ node.versions[vi].approvers }} -->
          <div
            style="width: 320px;"
            v-for="(u, i) in node.versions[vi].approvers" :key="'approvers' + i">
            <!-- <q-card bordered class="no-shadow" v-if="u.file" >
              <div v-if="$lodash.isImage(u.file.fileName)" class="thumbnail">
                <img :src="`${$dbCon.io.io.uri}/uploads?_id=${u.file._id}`" class="portrait" alt="Image" />
              </div>
              <div v-else-if="$lodash.isVideo(u.file.fileName)" class="thumbnail">
                <video controls class="thumbnail" preload="none">
                  <source :src="`${$dbCon.io.io.uri}/uploads?_id=${u.file._id}`">
                  Your browser does not support the video tag.
                </video>
              </div>
              <div v-else class="row justify-center bg-blue-grey-1">
                <q-icon name="insert_drive_file" size="72px" color="blue-grey-14 thumbnail" class="q-pt-md q-pb-md" />
              </div>

              <q-card-section style="max-height: 56px;" class="row items-center no-wrap">
                <div class="col text-weight-regular limited-text" :class="{
                    'text-primary': $root.clickedItem._id === u.file._id,
                    'text-blue-grey-14': $root.clickedItem._id !== u.file._id
                  }">
                  <q-btn round flat class="bg-white q-mr-sm" color="blue-grey-14" size="sm" icon="insert_drive_file"></q-btn>
                  <span>
                    Signed Document
                  </span>
                </div>
                <div class="col-auto">
                    <q-btn @click="open(u.file._id)" round icon="cloud_download" class="no-shadow text-grey-7" color="grey-11" size="sm" >
                    </q-btn>
                </div>
              </q-card-section>
            </q-card> -->
            <!-- <q-uploader
              v-if="u.value._id === $root.user._id && !u.approved"
              hide-upload-btn
              :ref="'attachUploader' + i"
              :headers="[{ name: 'Authorization', value: jwt}]"
              :url="$dbCon.io.io.uri + '/uploads'"
              field-name="file"
              @uploaded="(file) => {uploaded(file, i)}"
            /> -->
            <div class="row q-pt-md">
              <div class="col">
                <div>{{ u.label }}</div>
                <!-- <div v-if="u.file.dateUploaded" class="text-caption text-grey">{{ $moment(u.file.dateUploaded).format('lll') }}</div> -->
                <!-- <pre>{{ node.versions[vi].initiator }}</pre>
                <pre>{{ $root.user._id }}</pre> -->
                <q-chip dense v-if="u.approved">
                  <q-avatar icon="thumb_up" color="green" text-color="white" />
                  {{ $moment(u.timestamp).format('lll') }}
                </q-chip>
                <q-chip dense v-else>
                  <q-avatar icon="edit" color="grey" text-color="white" />
                  for signature
                </q-chip>
              </div>
              <q-btn
              v-if="!u.approved && u.value._id === $root.user._id"
              :disabled="(node.versions[vi].approvers[i-1] && !node.versions[vi].approvers[i-1].approved)"
              class="item-end"
              @click="() => {
                approve(i)
              }">
                Approve
              </q-btn>
            </div>
          </div>
        </div>
      <q-card-actions align="right" class="text-primary">
        <!-- <q-btn flat label="Cancel" v-close-popup /> -->
        <!-- {{ node.versions[vi].initiator === $root.user._id }} -->
        <q-btn
          :disabled="file.versions[vi].approved || file.versions[vi].initiator !== $root.user._id || !file.versions[vi]._id || node.versions[vi].initiator !== $root.user._id || node.versions[vi].approvers.filter(u => u.approved).length !== node.versions[vi].approvers.length"
          color="primary"
          label="Publish"
          @click="publish" />
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: [ 'draftDialog', 'node', 'vi' ],
  mounted () {
    this.refs = this.$refs
    this.$nextTick(() => {
      // this.draftUploader = this.$refs.draftUploader
      // console.log('mounted this.draftUploader', this.draftUploader)
    })
    // console.log('this.$refs.draftUploader', this.$refs.draftUploader)
  },
  data: function () {
    // let currentVersion = this.currentVersion(this.node)

    return ({
      refs: {},
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
    async approve (i) {
      this.$q.dialog({
        title: 'Approval Authentication',
        message: 'Enter Password',
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
          this.$q.loading.show({
            message: `Publishing signed draft`
          })
          let patch = {}
          patch[`versions.${this.vi}.approvers.${i}.approved`] = true
          patch[`versions.${this.vi}.approvers.${i}.timestamp`] = Date.now()
          await this.$dbCon.services['juan-files'].patch(this.node._id, patch)
          let key = 'approvers'
          this.node.security[key].map(async user => {
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
                arpproved a change request (${this.node.versions[this.vi].version})
                <a href="${url}">${this.node.label}</a> ${this.node.isFolder ? 'folder' : 'file'}
              `,
              url: `${url}`,
              html: {
                firstName: user.value.personal_information.first_name,
                message: `
                  ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
                  arpproved a change request (${this.node.versions[this.vi].version})
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
              action: `Arpproved revision request (${this.node.versions[this.vi].version})`,
              access: key,
              data: this.node,
              timestamp: Date.now(),
              seen: false
            })
          })
          this.$dbCon.services['juan-notifs'].create({
            from: this.$root.user,
            to: this.node.logs[0].user,
            action: `Arpproved revision request (${this.node.versions[this.vi].version})`,
            access: key,
            data: this.node,
            timestamp: Date.now(),
            seen: false
          })
          this.$q.loading.hide()
        } catch (error) {
          console.log(error)
          this.$q.notify({
            message: 'Wrong Password',
            position: 'bottom-right',
            color: 'negative'
          })
          this.$q.loading.hide()
        }
      })
    },
    async uploaded (info) {
      console.log('UPLOADED Trin')
      try {
        // let timestamp = Date.now()
        // let label = info.files[0].name
        let file = JSON.parse(info.xhr.response)
        file = Object.assign(file, this.revision)
        file.effectivityDate = (new Date(this.revision.effectivityDate)).getTime()
        file.dateUploaded = (new Date()).getTime()
        file.approvers = this.$lodash.cloneDeep(this.node.security.approvers)
        let patch = {}
        patch[`versions.${this.vi}._id`] = file._id
        await this.$dbCon.services['juan-files'].patch(this.node._id, patch)
        this.file.versions[0]._id = file._id
        this.$forceUpdate()
        this.$refs.draftUploader.reset()
      } catch (error) {
        this.$q.notify({
          message: error.toString(),
          position: 'bottom-right',
          color: 'negative'
        })
      }

      this.$q.loading.hide()
    },
    async publish () {
      let logs = this.$lodash.cloneDeep(this.node.logs)
      let patch = { logs }
      patch[`versions.${this.vi}.approved`] = true
      let log = {
        action: `New Version (${this.node.versions[this.vi].version})`,
        timestamp: Date.now(),
        data: this.node,
        user: this.$root.user
      }
      patch.logs.push(log)
      // patch.logs = logs
      let updatedFile = await this.$dbCon.services['juan-files'].patch(this.node._id, patch)
      this.$root.clickedItem = updatedFile
      this.$q.notify({
        message: `Version ${this.node.versions[this.vi].version} published`,
        position: 'bottom-right',
        color: 'positive'
      })
      Object.keys(this.node.security).map(key => {
        if (this.$lodash.isArray(this.node.security[key])) {
          this.node.security[key].map(async user => {
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
                published version (${this.node.versions[this.vi].version})
                <a href="${url}">${this.node.label}</a> ${this.node.isFolder ? 'folder' : 'file'}
              `,
              url: `${url}`,
              html: {
                firstName: user.value.personal_information.first_name,
                message: `
                  ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
                  published version (${this.node.versions[this.vi].version})
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
              action: `Published version ${this.node.versions[this.vi].version} of`,
              access: key,
              data: this.node,
              timestamp: Date.now(),
              seen: false
            })
          })
        }
      })
      let url = ''
      if (this.node.isFolder) {
        url = this.$host + '/#/myDrive/' + this.node._id
      } else {
        url = this.$host + '/#/myDrive/' + this.node.parentFolder + '?f=' + this.node._id
      }
      this.$axios.post(`${this.$dbCon.io.io.uri}/sendMail`, {
        to: this.logs[0].user.personal_information.email,
        subject: `OnlineISO: ${this.node.label}`,
        message: `
          ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
          published version (${this.node.versions[this.vi].version})
          <a href="${url}">${this.node.label}</a> ${this.node.isFolder ? 'folder' : 'file'}
        `,
        url: `${url}`,
        html: {
          firstName: this.logs[0].user.personal_information.first_name,
          message: `
            ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
            published version (${this.node.versions[this.vi].version})
          `,
          url: {
            text: 'Open "' + this.node.label + '"',
            link: url
          }
        }
      }, {
        'Content-Type': 'application/json'
      })
      this.$dbCon.services['juan-notifs'].create({
        from: this.$root.user,
        to: this.logs[0].user,
        action: `Published version ${this.node.versions[this.vi].version} of`,
        access: 'owner',
        data: this.node,
        timestamp: Date.now(),
        seen: false
      })
    },
    async patch (file = {}) {
      let patch = {}
      let rev = {}
      Object.assign(rev, file)
      Object.assign(rev, this.revision)
      rev.approvers = this.$lodash.cloneDeep(this.node.security.approvers)

      patch[`versions.${this.vi}._id`] = file.id
      await this.$dbCon.services['juan-files'].patch(this.node._id, patch)
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
            published version (${this.node.versions[this.vi].version})
            <a href="${url}">${this.node.label}</a> ${this.node.isFolder ? 'folder' : 'file'}
          `,
          url: `${url}`,
          html: {
            firstName: user.value.personal_information.first_name,
            message: `
              ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
              published version (${this.node.versions[this.vi].version})
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
      this.draftDialog[0].hide()
      this.$q.notify({
        message: 'Draft was edited',
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
      window.open(`${this.$dbCon.io.io.uri}/uploads?_id=${_id}` + `&direct=true` + '&t=' + this.$root.jwt, '_blank')
    }
  }
}
</script>
