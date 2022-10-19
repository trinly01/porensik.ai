<style>
.limited-text {
  white-space: nowrap;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<template>
  <q-menu anchor="top right" self="top left">
    <q-toolbar class="bg-grey-3 text-grey-14" style="min-height: 32px !important;">
      <q-btn @click="previousFolder" flat round dense size="sm" icon="arrow_back" v-if="parentNode.label !== 'My Drive'" />
      <div class="col text-center">
        {{ parentNode.label }}
      </div>
    </q-toolbar>
    <q-separator />
    <div style="height: 120px; overflow-y: scroll;">
      <q-list dense style="width: 250px">
        <q-item clickable v-ripple v-for="f in folders.filter(ff => {
            return ff._id !== node._id
          })" :key="f._id" :active="f._id === activeNode._id" @click="activeNode = {...f}" @dblclick="dblClickFolder(f)" active-class="bg-light-blue text-white">
          <q-item-section avatar>
            <q-btn round size="sm" flat>
              <q-icon :color="f._id === activeNode._id ? 'white' : 'blue-grey'" name="folder_open" size="sm" />
            </q-btn>
          </q-item-section>
          <q-item-section  >
            <span class="limited-text" >
              {{ f.label }}
            </span>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-separator />
    <div class="row q-pa-sm">
      <div class="col" >
        <q-btn v-close-popup v-if="!$lodash.isEmpty(activeNode)" color="primary" @click="move" >Move</q-btn>
        <q-btn v-close-popup v-else color="primary" :disabled="node.parentFolder === parentNode._id" @click="move" >Move here</q-btn>
      </div>
      <q-btn flat round text-color="grey-14" icon="create_new_folder" />
    </div>
  </q-menu>
</template>

<script>
export default {
  data: () => ({
    parentNode: {
      label: '...',
      parentFolder: 'My Drive',
      _id: 'My Drive'
    },
    folders: [],
    activeNode: {},
    tempNode: {}
  }),
  props: ['node'],
  mounted () {
    // this.activeNode = { ...this.node }
    this.getParentFolders(this.node)
    this.tempNode = this.$lodash.cloneDeep(this.node)
  },
  methods: {
    async move () {
      let oldParentFolder = this.node.parentFolder
      let movedTo = null
      if (this.$lodash.isEmpty(this.activeNode)) {
        this.tempNode.parentFolder = this.parentNode._id
        let log = {
          action: 'Moved',
          timestamp: Date.now(),
          data: {
            new: this.$deepDiff(this.tempNode, this.node),
            old: this.$deepDiff(this.node, this.tempNode)
          },
          user: this.$root.user
        }
        console.log('LOG', log)
        await this.$dbCon.services[this.node.isFolder ? 'juan-folders' : 'juan-files'].patch(this.node._id, {
          parentFolder: this.parentNode._id,
          logs: this.node.logs.concat([log])
        })
        movedTo = this.parentNode
      } else {
        this.tempNode.parentFolder = this.activeNode._id
        let log = {
          action: 'Moved',
          timestamp: Date.now(),
          data: {
            new: this.$deepDiff(this.tempNode, this.node),
            old: this.$deepDiff(this.node, this.tempNode)
          },
          user: this.$root.user
        }
        console.log('LOG', log)
        await this.$dbCon.services[this.node.isFolder ? 'juan-folders' : 'juan-files'].patch(this.node._id, {
          parentFolder: this.activeNode._id,
          logs: this.node.logs.concat([log])
        })
        movedTo = this.activeNode
      }
      this.$q.notify({
        message: this.node.label + 'was moved to ' + movedTo.label,
        position: 'bottom-left',
        actions: [
          {
            label: 'Undo',
            handler: async () => {
              await this.$dbCon.services[this.node.isFolder ? 'juan-folders' : 'juan-files'].patch(this.node._id, {
                parentFolder: oldParentFolder
              })
            }
          }
        ]
      })
    },
    async previousFolder (parent) {
      await this.getParentFolders(this.parentNode)
      this.activeNode = {}
      console.log('April 30', this.activeNode._id === this.parentNode._id, this.node.parentFolder === this.parentNode._id)
    },
    async dblClickFolder (node) {
      this.parentNode = { ...node }
      console.log(node)

      const { condition, $or } = this.$root.global
      const result = await this.$dbCon.services['juan-folders'].find({
        query: {
          $limit: 500,
          parentFolder: node._id,
          ...condition,
          $or
        }
      })

      this.folders = result.data
      this.activeNode = {}
    },
    async getParentFolders (node) {
      console.log(node)
      if (node.parentFolder === 'My Drive') {
        this.parentNode = {
          label: 'My Drive',
          parentFolder: 'My Drive',
          _id: 'My Drive'
        }
      } else {
        this.parentNode = await this.$dbCon.services['juan-folders'].get(node.parentFolder)
      }

      const condition = {
        $sort: {
          'logs.0.timestamp': -1
        },
        trash: {
          $ne: true
        }
      }
      const $or = [
        { 'security.public': true },
        { 'security.public': { $ne: false } },
        { owner: this.$root.user._id },
        { 'security.viewers': { $elemMatch: { 'value._id': this.$root.user._id } } },
        { 'security.uploaders': { $elemMatch: { 'value._id': this.$root.user._id } } },
        { 'security.modifiers': { $elemMatch: { 'value._id': this.$root.user._id } } },
        { 'security.removers': { $elemMatch: { 'value._id': this.$root.user._id } } },
        { 'security.folderCreators': { $elemMatch: { 'value._id': this.$root.user._id } } },
        { 'security.approvers': { $elemMatch: { 'value._id': this.$root.user._id } } }
      ]
      const result = await this.$dbCon.services['juan-folders'].find({
        query: {
          $limit: 500,
          parentFolder: node.parentFolder,
          ...condition,
          $or
        }
      })

      this.folders = result.data
    }
  }
}
</script>
