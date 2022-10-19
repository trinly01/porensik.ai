<template>
  <q-menu
    v-if="!ownerPrompt && !newDocPrompt && !signaturePrompt && !responsesPrompt && !formPrompt && !viewFormIsOpen && !shareDialogIsOpen && !renameFolderPrompt && !versionsDialogIsOpen"
    ref="nodeMenu"
    touch-position
  >
    <q-list v-if="!!node.security" dense style="min-width: 200px" class="q-pt-sm q-pb-sm">
      <!-- <q-item clickable v-close-popup>
        <q-item-section>New Folder</q-item-section>
      </q-item> -->
      <q-item v-ripple @click="open(node)" clickable >
        <q-item-section avatar>
          <q-icon color="blue-grey" name="remove_red_eye" />
        </q-item-section>
        <q-item-section>Open</q-item-section>
      </q-item>

      <q-item
        v-if="
          node.type &&
          node.type === 'form'
        "
        v-ripple @click="showResponses" clickable
      >
        <q-item-section avatar>
          <q-icon color="blue-grey" name="data_usage" />
        </q-item-section>
        <q-item-section>Responses</q-item-section>
      </q-item>

      <q-item
        v-if="
          node.type &&
          node.type === 'form'
        "
        v-ripple @click="showForSignature" clickable
      >
        <q-item-section avatar>
          <q-icon color="blue-grey" name="fas fa-signature" size="18px" style="left: 5px;" />
        </q-item-section>
        <q-item-section>for Signature</q-item-section>
      </q-item>

      <q-separator class="q-mt-sm q-mb-sm" v-show="$lodash.findIndex(node.security.approvers, user => user.value._id === $root.user._id) > -1" />
      <q-item v-if="node.security.approvers && node.security.approvers.length"
      v-ripple clickable
      v-show="$lodash.findIndex(node.security.approvers, user => user.value._id === $root.user._id) > -1" >
        <q-item-section avatar>
          <q-icon color="blue-grey" name="thumb_up" />
        </q-item-section>
        <q-item-section>Approved
          ({{node.security.approvers.filter(u => u.approved).length}}/{{node.security.approvers.length}})
        </q-item-section>
        <approve-dialog v-if="node.security.approvers.filter(u => !u.approved).length" :node="node"/>
      </q-item>

      <q-separator class="q-mt-sm q-mb-sm" v-show="$lodash.findIndex(node.security.modifiers, user => user.value._id === $root.user._id) > -1 || node.owner === $root.user._id" />

      <q-item v-show="$lodash.findIndex(node.security.modifiers, user => user.value._id === $root.user._id) > -1 || node.owner === $root.user._id"
      clickable v-ripple @click="shareDialogIsOpen = true, showSecurity()">
        <q-item-section avatar>
          <q-icon color="blue-grey" name="share" />
        </q-item-section>
        <q-item-section>Share/Secure</q-item-section>
      </q-item>

      <q-item v-show="$lodash.findIndex(node.security.modifiers, user => user.value._id === $root.user._id) > -1 || node.owner === $root.user._id"
      clickable v-ripple @click="copySecurity(node)">
        <q-item-section avatar>
          <q-icon color="blue-grey" name="far fa-object-ungroup" />
        </q-item-section>
        <q-item-section>Copy Security</q-item-section>
      </q-item>

      <q-item v-show="$lodash.findIndex(node.security.modifiers, user => user.value._id === $root.user._id) > -1 || node.owner === $root.user._id"
      clickable v-ripple @click="pasteSecurity">
        <q-item-section avatar>
          <q-icon color="blue-grey" name="fas fa-object-ungroup" />
        </q-item-section>
        <q-item-section>Paste Security</q-item-section>
      </q-item>

      <!-- <q-item v-show="$lodash.findIndex(node.security.modifiers, user => user.value._id === $root.user._id) > -1 || node.owner === $root.user._id"
      clickable v-ripple @click="shareDialogIsOpen = true, showSecurity()">
        <q-item-section avatar>
          <q-icon color="blue-grey" name="fas fa-people-arrows" />
        </q-item-section>
        <q-item-section>Change Owner</q-item-section>
      </q-item> -->

      <q-item v-show="$lodash.findIndex(node.security.modifiers, user => user.value._id === $root.user._id) > -1 || node.owner === $root.user._id"
        clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="blue-grey" name="subdirectory_arrow_right" />
        </q-item-section>
        <q-item-section>Move to</q-item-section>
        <move-to :node="node" />
      </q-item>

      <!-- <q-item clickable v-ripple @click="() => $refs.newMenu.toggle()">
        <q-item-section avatar>
          <q-icon color="blue-grey" name="star_outline" />
        </q-item-section>
        <q-item-section>Add to Starred</q-item-section>
      </q-item> -->
      <q-item v-close-popup
      clickable v-ripple @click="copyUrl(node)">
        <q-item-section avatar>
          <q-icon color="blue-grey" name="fas fa-clipboard" />
        </q-item-section>
        <q-item-section>Copy Link</q-item-section>
      </q-item>

      <q-item v-close-popup v-show="!node.isFolder && (node.security.canDuplicate || node.owner === $root.user._id)"
      clickable v-ripple @click="duplicate(node)">
        <q-item-section avatar>
          <q-icon color="blue-grey" name="file_copy" />
        </q-item-section>
        <q-item-section>Duplicate</q-item-section>
      </q-item>

      <q-item v-show="$lodash.findIndex(node.security.modifiers, user => user.value._id === $root.user._id) > -1 || node.owner === $root.user._id"
      clickable v-ripple @click="showRenameModal" >
        <q-item-section avatar>
          <q-icon color="blue-grey" name="edit" />
        </q-item-section>
        <q-item-section>Rename</q-item-section>
      </q-item>

      <q-item v-if="
          node.type &&
          ['form', 'doc'].includes(node.type) &&
          (
            node.owner === $root.user._id ||
            $lodash.findIndex(node.security.modifiers, user => user.value._id === $root.user._id) > -1
          )
        "
        v-ripple @click="modify(node)" clickable
      >
        <q-item-section avatar>
          <q-icon color="blue-grey" name="fas fa-edit" size="20px" style="position: relative; left: 4px" />
        </q-item-section>
        <q-item-section>Modify</q-item-section>
      </q-item>
      <!-- <q-item clickable v-ripple @click="() => $refs.newMenu.toggle()">
        <q-item-section avatar>
          <q-icon color="blue-grey" name="color_lens" />
        </q-item-section>
        <q-item-section>Change Color</q-item-section>
      </q-item> -->
      <q-item v-if="!node.isFolder && node.type === 'doc'" clickable v-ripple @click="versionsDialogIsOpen = true">
        <q-item-section avatar>
          <q-icon color="blue-grey" name="color_lens" />
        </q-item-section>
        <q-item-section>Versions</q-item-section>
        <q-item-section v-if="node.draft">
          <q-chip dense color="deep-orange" text-color="white" label=" Draft" />
        </q-item-section>
      </q-item>
      <q-item v-else-if="!node.isFolder && node.versions" clickable v-ripple @click="versionsDialogIsOpen = true">
        <q-item-section avatar>
          <q-icon color="blue-grey" name="color_lens" />
        </q-item-section>
        <q-item-section>Versions</q-item-section>
      </q-item>

      <q-separator class="q-mt-sm q-mb-sm" />

      <q-item v-show="node.owner === $root.user._id"
      clickable v-ripple @click="showOwnerModal" >
        <q-item-section avatar>
          <q-icon color="blue-grey" name="edit" />
        </q-item-section>
        <q-item-section>Transfer Ownership</q-item-section>
      </q-item>

      <q-item v-close-popup v-show="$lodash.findIndex(node.security.removers, user => user.value._id === $root.user._id) > -1 || node.owner === $root.user._id"
      clickable v-ripple @click="remove">
        <q-item-section avatar>
          <q-icon color="blue-grey" name="delete_outline" />
        </q-item-section>
        <q-item-section>Remove</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
  <q-dialog ref="newDocPrompt" v-else-if="newDocPrompt" v-model="newDocPrompt" persistent>
    <new-doc v-if="modifying" :refs="$refs" :modify="node"></new-doc>
    <new-doc v-else :refs="$refs" :view="node" :versions="node.versions"></new-doc>
  </q-dialog>
  <q-dialog v-else-if="responsesPrompt" v-model="responsesPrompt" persistent>
    <juan-responses :node="node" :userID="node.owner === $root.user._id ? false : $root.user._id"></juan-responses>
  </q-dialog>
  <q-dialog v-else-if="signaturePrompt" v-model="signaturePrompt" persistent>
    <for-signature :node="node" :userID="$root.user._id"></for-signature>
  </q-dialog>
  <q-dialog v-else-if="viewFormIsOpen" v-model="viewFormIsOpen" persistent>
    <view-form :node="node"></view-form>
  </q-dialog>
  <q-dialog ref="formPrompt" v-else-if="formPrompt" v-model="formPrompt" persistent>
    <juan-form :refs="$refs" v-model="form"></juan-form>
  </q-dialog>
  <q-dialog
  ref="versionsDialog"
  v-else-if="versionsDialogIsOpen"
  v-model="versionsDialogIsOpen">
    <doc-versions v-if="node.type === 'doc'" :node="node"></doc-versions>
    <versions-dialog v-else :node="node"></versions-dialog>
  </q-dialog>
  <q-dialog v-else-if="shareDialogIsOpen" v-model="shareDialogIsOpen" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="row">
        <div class="text-h6 col">Share/Secure</div>
        <div>
          <q-btn-toggle
            v-model="security.public"
            :value="security.public"
            size="xs"
            toggle-color="primary"
            :options="[
              {label: 'Private', value: false},
              {label: 'System-wide', value: 'system'},
              {label: 'Public', value: true}
            ]"
          />
        </div>
      </q-card-section>
      <q-card-section class="row">
        <div class="col"></div>
        <div>
          <q-checkbox left-label v-model="security.personalInfo" label="Contains personal info" />
        </div>
      </q-card-section>

      <q-card-section>
        <!-- {{security.viewers}} -->
        <q-select
          v-model="security.viewers"
          :options="searchedUsers"
          label="View"
          multiple
          use-chips
          use-input
          ref="viewers"
          @input="$refs.viewers.updateInputValue('')"
          @filter="searchUsers"
        />
        <q-select
          v-if="node.isFolder"
          v-model="security.uploaders"
          :options="searchedUsers"
          label="Upload"
          multiple
          use-chips
          use-input
          ref="uploaders"
          @input="$refs.uploaders.updateInputValue('')"
          @filter="searchUsers"
        />
        <q-select
          v-model="security.modifiers"
          :options="searchedUsers"
          label="Modify"
          multiple
          use-chips
          use-input
          ref="modifiers"
          @input="$refs.modifiers.updateInputValue('')"
          @filter="searchUsers"
        />
        <q-select
          v-model="security.removers"
          :options="searchedUsers"
          label="Remove"
          multiple
          use-chips
          use-input
          ref="removers"
          @input="$refs.removers.updateInputValue('')"
          @filter="searchUsers"
        />
        <!-- <q-select
          v-if="node.isFolder"
          v-model="security.folderCreators"
          :options="searchedUsers"
          label="Create Folder"
          multiple
          use-chips
          use-input
          ref="folderCreators"
          @input="$refs.folderCreators.updateInputValue('')"
          @filter="searchUsers"
        /> -->
        <q-select
          v-if="!node.isFolder"
          v-model="security.approvers"
          :options="searchedUsers"
          label="Approvers"
          multiple
          use-chips
          use-input
          ref="approvers"
          @input="$refs.approvers.updateInputValue('')"
          @filter="searchUsers"
        />
        <!-- <q-input dense v-model="folderName" autofocus @keyup.enter="newFolderPrompt = false" @focus="$refs.target.select()" /> -->
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn color="primary" label="Save" @click="saveSecurity" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-else-if="renameFolderPrompt" v-model="renameFolderPrompt" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6"> Rename {{ node.isFolder ? 'folder' : 'file' }}</div>
      </q-card-section>

      <q-card-section>
        <q-input ref="target" dense v-model="tempNode.label" autofocus @keyup.enter="newFolderPrompt = false" @focus="$refs.target.select()" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn color="primary" label="Save" @click="saveFolder" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-else-if="ownerPrompt" v-model="ownerPrompt" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6"> Transfer Ownership</div>
      </q-card-section>

      <q-card-section>
        <!-- {{ tempNode.owner }} -->
        <q-select
          v-model="tempNode.owner"
          :options="searchedUsers"
          label="Approvers"
          use-chips
          use-input
          ref="owner"
          @filter="searchUsers"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn color="primary" label="Save" @click="saveOwner" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
// import { cloneDeep, isEmpty } from 'lodash'
import moveTo from 'components/moveTo.vue'
import versionsDialog from 'components/versionsDialog.vue'
import approveDialog from 'components/approveDialog.vue'
import viewForm from 'components/viewForm.vue'
import juanForm from 'components/juanForm.vue'
import juanResponses from 'components/juanResponses.vue'
import forSignature from 'components/forSignature.vue'
import newDoc from 'components/newDoc.vue'
import docVersions from 'components/docVersions.vue'
export default {
  components: { docVersions, newDoc, forSignature, moveTo, versionsDialog, approveDialog, viewForm, juanForm, juanResponses },
  mounted () {
    // console.log('mounted na')
    this.tempNode = this.$lodash.cloneDeep(this.node)
  },
  props: ['node'],
  data: () => ({
    ownerPrompt: false,
    modifying: false,
    form: {},
    newDocPrompt: false,
    signaturePrompt: false,
    responsesPrompt: false,
    formPrompt: false,
    viewFormIsOpen: false,
    versionsDialogIsOpen: false,
    renameFolderPrompt: false,
    tempNode: { label: '' },
    shareDialogIsOpen: false,
    searchedUsers: [],
    security: {
      public: false,
      viewers: [],
      uploaders: [],
      modifiers: [],
      removers: [],
      folderCreators: [],
      approvers: []
    }
  }),
  methods: {
    async duplicate (file) {
      let f = this.$lodash.cloneDeep(file)
      delete f._id
      f.label += '(Copy)'
      f.logs = [
        {
          action: 'created',
          timestamp: Date.now(),
          user: this.$root.user
        }
      ]

      if (this.node.versions) {
        f.versions = [
          this.node.versions.length === 1 || this.node.versions[0].approved
            ? this.node.versions[0]
            : this.node.versions[1]
        ]
      }

      this.$root.clickedItem = await this.$dbCon.services['juan-files'].create(f)
    },
    open (node) {
      // selectedPath
      if (node.type && node.type === 'doc') {
        this.newDocPrompt = true
      } else if (node.type && node.type === 'form') {
        // this.$router.push('/myDrive/' + node._id)
        this.viewFormIsOpen = true
      } else if (node.isFolder) {
        this.$router.push('/myDrive/' + node._id)
      } else {
        if (node.versions.length === 1 || node.versions[0].approved) {
          window.open(`${this.$dbCon.io.io.uri}/uploads?_id=${node._id}${
            node.security.public !== true ? '&t=' + this.$root.jwt : ''
          }`, '_blank')
          // window.open(`${this.$dbCon.io.io.uri}/uploads?_id=${node.versions[0]._id}`, '', 'menubar=no, toolbar=no, location=center, status=no, scrollbars=no, resizable=no, dependent')
        } else {
          window.open(`${this.$dbCon.io.io.uri}/uploads?_id=${node._id}${
            node.security.public !== true ? '&t=' + this.$root.jwt : ''
          }`, '_blank')
          // window.open(`${this.$dbCon.io.io.uri}/uploads?_id=${node.versions[1]._id}`, '', 'menubar=no, toolbar=no, location=center, status=no, scrollbars=no, resizable=no, dependent')
        }
      }
      this.modifying = false
    },
    pasteSecurity () {
      try {
        this.shareDialogIsOpen = true
        this.showSecurity()
        setTimeout(() => {
          this.security = JSON.parse(this.$root.$clipboard)
        }, 200)
      } catch (error) {
        this.$q.notify({
          message: 'Invalid Security Config',
          position: 'bottom-left',
          color: 'negative'
        })
      }
    },
    copySecurity (node) {
      const secString = JSON.stringify(node.security)
      this.$root.$clipboard = secString
      this.$root.clippy(secString).then(() => {
        this.$root.$clipboard = secString
        this.$q.notify({
          message: 'Security Config Copied',
          position: 'bottom-left'
        })
      }).catch(e => {
        console.log(e)
        this.$q.notify({
          message: e,
          position: 'bottom-left',
          color: 'negative'
        })
      })
    },
    copyUrl (node) {
      let url = ''
      if (node.isFolder) {
        this.$router.push('/myDrive/' + node._id)
        // url = window.location.href
      } else if (node.type && ['doc', 'form'].includes(node.type)) {
        this.$router.push('/myDrive/' + node.parentFolder + '?f=' + node._id)
        // url = window.location.href
      } else if (node.versions && (node.versions.length === 1 || node.versions[0].approved)) {
        url = `${this.$dbCon.io.io.uri}/uploads?_id=${node._id}${
          node.security.public !== true ? '&t=' + this.$root.jwt : ''
        }`
        // window.open(`${this.$dbCon.io.io.uri}/uploads?_id=${node._id}${
        //   node.security.public !== true ? '&t=' + this.$root.jwt : ''
        // }`, '_blank')
        // window.open(`${this.$dbCon.io.io.uri}/uploads?_id=${node.versions[0]._id}`, '', 'menubar=no, toolbar=no, location=center, status=no, scrollbars=no, resizable=no, dependent')
      } else {
        url = `${this.$dbCon.io.io.uri}/uploads?_id=${node._id}${
          node.security.public !== true ? '&t=' + this.$root.jwt : ''
        }`
        // window.open(`${this.$dbCon.io.io.uri}/uploads?_id=${node._id}${
        //   node.security.public !== true ? '&t=' + this.$root.jwt : ''
        // }`, '_blank')
        // window.open(`${this.$dbCon.io.io.uri}/uploads?_id=${node.versions[1]._id}`, '', 'menubar=no, toolbar=no, location=center, status=no, scrollbars=no, resizable=no, dependent')
      }

      this.$root.clippy(url).then(() => {
        console.log('url', url)
        this.$q.notify({
          message: 'Coppied: ' + url,
          position: 'bottom-left'
        })
      }).catch(e => {
        console.log(e)
        this.$q.notify({
          message: e,
          position: 'bottom-left',
          color: 'negative'
        })
      })
    },
    showSecurity () {
      this.security = this.$lodash.cloneDeep(this.node.security)
    },
    modify (node) {
      if (node.type && node.type === 'doc') {
        this.newDocPrompt = true
      } else if (node.type && node.type === 'form') {
        this.form = this.$lodash.cloneDeep(this.node)
        this.formPrompt = true
      }
      this.modifying = true
    },
    showResponses (node) {
      this.responsesPrompt = true
    },
    showForSignature () {
      this.signaturePrompt = true
    },
    showRenameModal () {
      this.renameFolderPrompt = true
      this.tempNode = this.$lodash.cloneDeep(this.node)
    },
    showOwnerModal () {
      this.ownerPrompt = true
      this.tempNode = this.$lodash.cloneDeep(this.node)
    },
    async saveOwner () {
      const timestamp = Date.now()
      let log = {
        action: 'Ownership Transferred',
        timestamp,
        data: {
          new: this.$deepDiff(this.tempNode, this.node),
          old: this.$deepDiff(this.node, this.tempNode)
        },
        user: this.$root.user
      }

      console.log(this.tempNode.owner.value._id, this.node.owner)

      const newOwnerId = this.tempNode.owner.value._id
      const oldOwnerId = this.node.owner

      const user = this.tempNode.owner

      await this.$dbCon.services[this.node.isFolder ? 'juan-folders' : 'juan-files'].patch(this.node._id, {
        owner: newOwnerId,
        logs: this.tempNode.logs.concat([log])
      })

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
          transferred
          <a href="${url}">${this.node.label}</a> ${this.node.isFolder ? 'folder' : 'file'}
          to you
        `,
        url: `${url}`,
        html: {
          firstName: user.value.personal_information.first_name,
          message: `
            ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
            transferred ${this.node.isFolder ? 'folder' : 'file'} ownership to you.
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
        action: 'ownership transfer',
        data: this.node,
        timestamp: Date.now(),
        seen: false
      })

      this.$q.notify({
        message: this.node.label + ' was transferred',
        position: 'bottom-left',
        actions: [
          {
            label: 'Undo',
            handler: async () => {
              const timestamp = Date.now()
              let log = {
                action: 'Recovered',
                timestamp,
                user: this.$root.user
              }
              await this.$dbCon.services[this.node.isFolder ? 'juan-folders' : 'juan-files'].patch(this.node._id, {
                owner: oldOwnerId,
                logs: this.tempNode.logs.concat([log])
              })

              this.$q.notify({
                message: this.node.label + ' was restored',
                position: 'bottom-left'
              })
            }
          }
        ]
      })

      this.ownerPrompt = false
    },
    async saveFolder () {
      this.tempNode.security = this.security
      const timestamp = Date.now()
      let log = {
        action: 'renamed',
        timestamp,
        data: {
          new: this.$deepDiff(this.tempNode, this.node),
          old: this.$deepDiff(this.node, this.tempNode)
        },
        user: this.$root.user
      }
      // this.tempNode.logs.push()
      // console.log('LOG', this.tempNode.logs.concat([log]))
      await this.$dbCon.services[this.node.isFolder ? 'juan-folders' : 'juan-files'].patch(this.node._id, {
        label: this.tempNode.label,
        logs: this.tempNode.logs.concat([log])
      })
      this.renameFolderPrompt = false
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
    },
    async saveSecurity () {
      const update = this.$deepDiff(this.security, this.node.security)
      this.tempNode.security = this.security

      const timestamp = Date.now()
      let log = {
        action: 'Shared',
        timestamp,
        data: {
          new: this.$deepDiff(this.tempNode, this.node),
          old: this.$deepDiff(this.node, this.tempNode)
        },
        user: this.$root.user
      }
      await this.$dbCon.services[this.node.isFolder ? 'juan-folders' : 'juan-files'].patch(this.node._id, {
        security: this.security,
        logs: this.tempNode.logs.concat([log])
      })

      // security: {
      //   public: false,
      //   viewers: [],
      //   uploaders: [],
      //   modifiers: [],
      //   removers: [],
      //   folderCreators: []
      // }
      this.shareDialogIsOpen = false

      if (!this.$lodash.isEmpty(update)) {
        console.log('Security has Update')
        Object.keys(update).map(key => {
          console.log(key, update[key])
          if (this.$lodash.isArray(update[key])) {
            update[key].map(async user => {
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
                  shared
                  <a href="${url}">${this.node.label}</a> ${this.node.isFolder ? 'folder' : 'file'}
                `,
                url: `${url}`,
                html: {
                  firstName: user.value.personal_information.first_name,
                  message: `
                    ${this.$root.user.personal_information.first_name} ${this.$root.user.personal_information.surname}
                    shared a ${this.node.isFolder ? 'folder' : 'file'}
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
                action: 'shared',
                access: key,
                data: this.node,
                timestamp: Date.now(),
                seen: false
              })
            })
          }
        })
      }
    },
    remove () {
      this.$root.clickedItem = this.$root.nodeFormat
      this.$q.dialog({
        title: 'Confirm',
        message: `Would you like to delete this ${this.node.label}`,
        ok: {
          // push: true
          color: 'negative'
        },
        cancel: {},
        persistent: true
      }).onOk(async () => {
        this.$root.clickedItem = this.$root.nodeFormat

        this.tempNode.security = this.security
        const timestamp = Date.now()
        let log = {
          action: 'Trashed',
          timestamp,
          user: this.$root.user
        }

        await this.$dbCon.services[this.node.isFolder ? 'juan-folders' : 'juan-files'].patch(this.node._id, {
          trash: true,
          logs: this.tempNode.logs.concat([log])
        })

        this.$q.notify({
          message: this.node.label + ' was removed',
          position: 'bottom-left',
          actions: [
            {
              label: 'Undo',
              handler: async () => {
                const timestamp = Date.now()
                let log = {
                  action: 'Recovered',
                  timestamp,
                  user: this.$root.user
                }
                await this.$dbCon.services[this.node.isFolder ? 'juan-folders' : 'juan-files'].patch(this.node._id, {
                  trash: false,
                  logs: this.tempNode.logs.concat([log])
                })

                this.$q.notify({
                  message: this.node.label + ' was restored',
                  position: 'bottom-left'
                })
              }
            }
          ]
        })
      })
    }
  }
}
</script>
