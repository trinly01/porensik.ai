<style>
.absolute-full > .scroll,
.scroll > .q-layout--containerized {
  height: calc(100% - 50px);
}
.q-page-container {
  height: 100%
}
del, .del {
  text-decoration: none;
  color: #b30000;
  background: #fadad7;
}
ins, .ins {
  background: #eaf2c2;
  color: #406619;
  text-decoration: none;
}
.result {
  font-family: 'Roboto'; font: 1em Roboto; white-space: pre-wrap;
}
</style>
<template>
  <q-dialog ref="qDialogDiff">
    <q-layout class="bg-white text-black" container style="min-width: 80vw;">
      <q-header class="bg-white text-black shadow-up-1">
        <q-toolbar class="">
          <q-btn flat round dense icon="fas fa-file-alt" color="blue" />
          <q-toolbar-title v-if="node && node.draft && node.draft.approvers"> Change Request </q-toolbar-title>
          <q-toolbar-title v-else> Difference </q-toolbar-title>
          <q-toolbar-title>
            <i class="text-body1"><span v-html="diff(old.label, update.label)" /></i>
            &nbsp; <i class="text-body1">(v. <span v-html="diff(old.version, update.version)" />)</i>
          </q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-header>
      <q-page-container class="q-pa-md">
        <div class="col q-pa-md items-end">
          <div class="row">
            <div class="col"></div>
            <div>
              <q-chip dense class="ins">inserted</q-chip>
              <q-chip dense class="del">removed</q-chip>
            </div>
          </div>
          <!-- {{ diff(old.content, update.content) }} -->
          <!-- <pre v-for="(ln, i) in update.content.split('\n')" :key="i+'ln'"
            v-html="diff(ln, ln)"
          /> -->
          <pre class="result" v-html="diff(old.content, update.content)" />
          <wysiwyg v-if="false" ref="wysiwyg" :value="diff(old.content, update.content)" view></wysiwyg>
          <div class="q-pt-xl" v-if="node && node.draft && node.draft.approvers">
            Approvers
          </div>
          <div class="row q-pa-md q-gutter-xl" v-if="node && node.draft && node.draft.approvers">
            <div
              style=""
              v-for="(u, i) in node.draft.approvers" :key="'approvers' + i">
              <div class="row q-pt-md q-gutter-md">
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
                    <!-- <q-avatar icon="notification_important" text-color="white" style="position: relative; left: 12px; cursor: pointer;" /> -->
                  </q-chip>
                </div>
                <q-btn
                v-if="!u.approved && u.value._id === $root.user._id"
                :disabled="(node.draft.approvers[i-1] && !node.draft.approvers[i-1].approved)"
                class="item-end"
                @click ="approve(i)">
                  Approve
                </q-btn>
                <q-btn
                v-if="
                !(node.draft.approvers[i-1] && !node.draft.approvers[i-1].approved)
                &&
                !u.approved"
                :disabled="(node.draft.approvers[i-1] && !node.draft.approvers[i-1].approved)"
                class="item-end"
                @click="notifySigner(u)">
                  Notify
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </q-page-container>
      <q-footer>
        <q-toolbar class="bg-white text-black shadow-1">
          <q-toolbar-title></q-toolbar-title>
          <q-btn
            v-close-popup
            flat
            color="primary"
            label="Close" />
          <q-btn
            v-if="
              node && node.draft
            "
            :disabled="node && node.draft && node.draft.approvers && node.draft.approvers.filter(u => u.approved).length !== node.draft.approvers.length
            ||
            !(node.owner === $root.user._id || $lodash.findIndex(node.security.modifiers, user => user.value._id == $root.user._id) > -1)"
            color="primary"
            label="Publish"
            @click="publish" />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script>
let Diff = require('diff')
import wysiwyg from './wysiwyg.vue'
// let wysiwyg = process.env.CLIENT ? require('./wysiwyg.vue') : {}

export default {
  props: ['node', 'old', 'update'],
  components: { wysiwyg },
  mounted () {
    console.log('Diff', Diff)
  },
  methods: {
    async publish () {
      let draft = this.$lodash.cloneDeep(this.node.draft)
      draft.dateUpoaded = Date.now()
      let patch = { ...draft }
      delete patch.version
      delete patch.dateUpoaded
      let log = {
        action: `New Version (${this.node.draft.version})`,
        timestamp: Date.now(),
        user: this.$root.user
      }
      patch[`draft`] = null
      patch[`draft`] = null
      patch['$push'] = {
        logs: log
      }
      if (this.node.versions) {
        patch['$push'].versions = draft
      } else {
        patch.versions = [{
          content: this.node.content,
          label: this.node.label,
          dateUpoaded: this.node.logs[0].timestamp,
          version: 0
        }, draft]
      }
      // patch.logs = logs
      let updatedFile = await this.$dbCon.services['juan-files'].patch(this.node._id, patch)
      this.$root.clickedItem = updatedFile
      this.$q.notify({
        message: `Version ${this.node.draft.version} published`,
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
                published version (${this.node.draft.version})
                <a href="${url}">${this.node.label}</a> ${this.node.isFolder ? 'folder' : 'file'}
              `,
              url: `${url}`,
              html: {
                firstName: user.value.personal_information.first_name,
                message: `
                  ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
                  published version (${this.node.draft.version})
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
              action: `Published version ${this.node.draft.version} of`,
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
        to: this.node.logs[0].user.personal_information.email,
        subject: `OnlineISO: ${this.node.label}`,
        message: `
          ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
          published version (${this.node.draft.version})
          <a href="${url}">${this.node.label}</a> ${this.node.isFolder ? 'folder' : 'file'}
        `,
        url: `${url}`,
        html: {
          firstName: this.node.logs[0].user.personal_information.first_name,
          message: `
            ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
            published version (${this.node.draft.version})
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
        to: this.node.logs[0].user,
        action: `Published version ${this.node.draft.version} of`,
        access: 'owner',
        data: this.node,
        timestamp: Date.now(),
        seen: false
      })
    },
    async notifySigner (signer) {
      let url = this.$host + '/#/myDrive/' + this.node.parentFolder + '?f=' + this.node._id
      this.$axios.post(`${this.$dbCon.io.io.uri}/sendMail`, {
        to: signer.value.personal_information.email,
        subject: `OnlineISO: ${this.node.label}`,
        message: `
          ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
          notified you to sign the Change Request
          <i><a href="${url}">${this.node.label}</a></i> response
        `,
        url: `${url}`,
        html: {
          firstName: signer.value.personal_information.first_name,
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
            message: `Signing document`
          })
          let patch = {}
          patch[`draft.approvers.${i}.approved`] = true
          patch[`draft.approvers.${i}.timestamp`] = Date.now()
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
                arpproved a change request (${this.node.draft.version})
                <a href="${url}">${this.node.label}</a> ${this.node.isFolder ? 'folder' : 'file'}
              `,
              url: `${url}`,
              html: {
                firstName: user.value.personal_information.first_name,
                message: `
                  ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
                  arpproved a change request (${this.node.draft.version})
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
              action: `Arpproved revision request (${this.node.draft.version})`,
              access: key,
              data: this.node,
              timestamp: Date.now(),
              seen: false
            })
          })
          this.$dbCon.services['juan-notifs'].create({
            from: this.$root.user,
            to: this.node.logs[0].user,
            action: `Arpproved revision request (${this.node.draft.version})`,
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
    show () {
      console.log(this.$refs)
      this.$refs.qDialogDiff.show()
    },
    diff (a, b) {
      a = a || ''
      b = b || ''
      var diff = Diff.diffWords(a, b)
      var fragment = document.createDocumentFragment()
      for (var i = 0; i < diff.length; i++) {
        if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
          var swap = diff[i]
          diff[i] = diff[i + 1]
          diff[i + 1] = swap
        }

        var node
        if (diff[i].removed) {
          node = document.createElement('del')
          node.appendChild(document.createTextNode(diff[i].value))
        } else if (diff[i].added) {
          node = document.createElement('ins')
          node.appendChild(document.createTextNode(diff[i].value))
        } else {
          node = document.createTextNode(diff[i].value)
        }
        fragment.appendChild(node)
      }
      var p = document.createElement('p')
      p.appendChild(fragment)
      return p.innerHTML
    },
    changes (a, b) {
      var diff = Diff.diffChars(a, b).filter(x => x.removed || x.added)
      var fragment = document.createDocumentFragment()
      for (var i = 0; i < diff.length; i++) {
        if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
          var swap = diff[i]
          diff[i] = diff[i + 1]
          diff[i + 1] = swap
        }

        var node
        if (diff[i].removed) {
          node = document.createElement('del')
          node.appendChild(document.createTextNode(diff[i].value))
        } else if (diff[i].added) {
          node = document.createElement('ins')
          node.appendChild(document.createTextNode(diff[i].value))
        } else {
          node = document.createTextNode(diff[i].value)
        }
        fragment.appendChild(node)
      }
      var p = document.createElement('p')
      p.appendChild(fragment)
      return p.innerHTML
    }
  }
}
</script>
