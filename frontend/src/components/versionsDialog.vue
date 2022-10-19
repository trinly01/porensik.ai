<template>
  <q-card style="min-width: 400px">
    <q-card-section class="row">
      <div class="text-h6 col">Manage Version</div>
      <div>
        <q-btn
          v-if="(node.versions.length !== 1 ? node.versions[0].approved : true) && (node.owner === $root.user._id) || ($lodash.findIndex(node.security.modifiers, user => user.value._id === $root.user._id) > -1)"
          label="Request Change" @click="openDraftDialog"
        />
        <q-dialog ref="draftDialog" v-model="draftDialogIsOpen" persistent>
          <upload-draft :draftDialog="draftDialog" :node="node" />
        </q-dialog>
      </div>
    </q-card-section>
    <q-card-section class="col">
      <q-list dense style="min-width: 200px" class="q-pt-sm q-pb-sm">
        <q-item v-if="node.versions.length === 1" v-ripple clickable >
          <q-item-section avatar>
            <q-icon color="blue-grey" name="history" />
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">{{ node.versions[0].version }}</q-item-label>
            <q-item-label caption>{{ node.versions[0].dateUploaded }}</q-item-label>
          </q-item-section>
        </q-item>
        <span v-else>
          <q-item
          v-for="(ver, vi) in node.versions"
          :key="'ver'+vi"
          v-ripple clickable >
            <q-item-section avatar>
              <q-icon color="blue-grey" name="history" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ ver.version }}</q-item-label>
              <q-item-label caption>{{ $moment(ver.dateUploaded).format('lll') }}</q-item-label>
            </q-item-section>

            <q-item-section side v-if="!ver.approved && vi === 0">
              <q-chip color="deep-orange" text-color="white" icon="thumbs_up_down">
                Change Request
              </q-chip>
            </q-item-section>
            <q-item-section side v-if="!['doc'].includes(node.type) && !ver.approved && vi === 0 && ver.initiator === $root.user._id">
              <q-btn icon="edit" round size="sm" @click="openEditDraftDialog" />
              <q-dialog ref="editDraftDialog" v-model="editDraftDialogIsOpen" persistent>
                <edit-draft :draftDialog="editDraftDialog" :node="node" :vi="vi" />
              </q-dialog>
            </q-item-section>
            <q-item-section side v-if="!['doc'].includes(node.type) && vi !== node.versions.length - 1 && ($lodash.findIndex(node.security.approvers, user => user.value._id === $root.user._id) > -1 || node.logs[0].user._id === $root.user._id)">
              <q-dialog :ref="'viewDraftDialog'+vi" v-model="viewDraftDialogIsOpen[vi]" persistent>
                <view-draft :draftDialog="viewDraftDialog" :node="node" :vi="vi" />
              </q-dialog>
              <q-btn icon="search" round size="sm" @click="openViewDraftDialog(vi), viewDraftDialogIsOpen[vi] = true" />
            </q-item-section>
            <q-item-section side v-if="!['doc'].includes(node.type) && (ver.approved || vi !== 0)">
              <q-btn icon="cloud_download" round size="sm" @click="open(ver._id)"/>
            </q-item-section>
          </q-item>
        </span>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import uploadDraft from 'components/uploadDraft.vue'
import editDraft from 'components/editDraft.vue'
import viewDraft from 'components/viewDraft.vue'

export default {
  props: ['node'],
  components: { uploadDraft, editDraft, viewDraft },
  data: () => ({
    draftDialogIsOpen: false,
    editDraftDialogIsOpen: false,
    viewDraftDialogIsOpen: [],
    draftDialog: null,
    editDraftDialog: null,
    viewDraftDialog: null
  }),
  methods: {
    openViewDraftDialog (vi) {
      this.viewDraftDialog = this.$refs['viewDraftDialog' + vi]
      this.viewDraftDialogIsOpen[vi] = true
      this.$refs['viewDraftDialog' + vi][0].show()
    },
    openEditDraftDialog () {
      this.editDraftDialog = this.$refs.editDraftDialog
      this.editDraftDialogIsOpen = true
    },
    openDraftDialog () {
      this.draftDialog = this.$refs.draftDialog
      this.draftDialogIsOpen = true
    },
    open (_id) {
      window.open(`${this.$dbCon.io.io.uri}/uploads?_id=${_id}` + `&direct=true` + '&t=' + this.$root.jwt, '_blank')
    }
  }
}
</script>
