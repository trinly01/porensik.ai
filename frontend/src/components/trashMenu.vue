<template>
  <q-menu
    ref="newMenu"
    touch-position
  >
    <q-list dense style="min-width: 200px" class="q-pt-sm q-pb-sm">
      <!-- <q-item clickable v-close-popup>
        <q-item-section>New Folder</q-item-section>
      </q-item> -->
      <q-item v-close-popup v-ripple clickable @click="restore" >
        <q-item-section avatar>
          <q-icon color="blue-grey" name="restore" />
        </q-item-section>

        <q-item-section>Restore</q-item-section>
      </q-item>

      <q-item v-close-popup v-show="node.owner === $root.user._id"
      clickable v-ripple @click="removeAuth">
        <q-item-section avatar>
          <q-icon color="blue-grey" name="delete_outline" />
        </q-item-section>
        <q-item-section>Remove</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script>
// import { cloneDeep } from 'lodash'
// import moveTo from 'components/moveTo.vue'
export default {
  // components: { moveTo },
  mounted () {
    // console.log('mounted na')
    this.security = this.$lodash.cloneDeep(this.node.security)
  },
  props: ['node'],
  data: () => ({
    tempNode: { label: '' }
  }),
  methods: {
    async restore () {
      console.log('RESTORE', this.node._id)
      let log = {
        action: 'Recovered',
        timestamp: Date.now(),
        user: this.$root.user
      }

      await this.$dbCon.service(`juan-${this.node.isFolder ? 'folders' : 'files'}`).patch(this.node._id, {
        trash: false,
        logs: this.node.logs.concat([log])
      })

      this.$q.notify({
        message: this.node.label + ' was restored',
        position: 'bottom-left',
        actions: [
          {
            label: 'Open',
            handler: async () => {
              this.$router.push('/myDrive/' + this.node.parentFolder)
              await this.$dbCon.services['juan-folders'].reQuery({
                query: {
                  parentFolder: this.node.parentFolder,
                  trash: {
                    $ne: true
                  }
                }
              })
              this.$root.currentFolder = this.node
              this.$root.clickedItem = this.node

              this.$q.notify({
                message: this.node.label + 'was restored',
                position: 'bottom-left'
              })
            }
          }
        ]
      })
    },
    removeAuth () {
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
          this.remove()
        } catch (error) {
          this.$q.notify({
            message: 'Wrong Password',
            position: 'bottom-right',
            color: 'negative'
          })
        }
      })
    },
    remove () {
      this.$root.clickedItem = this.$root.currentFolder
      this.$q.dialog({
        title: 'Delete forever?',
        message: `${this.node.label} is about to be permanently deleted\nWarning: You can’t undo this action.`,
        ok: {
          // push: true
          label: 'Delete forever',
          color: 'negative'
        },
        cancel: {},
        persistent: true
      }).onOk(async () => {
        this.$root.clickedItem = this.$root.currentFolder
        let $or = [
          { _id: this.node._id }
        ]
        if (this.node.isFolder) $or.push({ parentFolder: this.node._id })
        await this.$dbCon.services[`juan-${this.node.isFolder ? 'folders' : 'files'}`].remove(null, {
          query: {
            $or
          }
        })

        this.$dbCon.service('uploads').remove(null, {
          query: {
            parentNode: this.node._id
          }
        })

        await this.$dbCon.services['juan-notifs'].remove(null, {
          query: {
            $or: [
              { 'data._id': this.node._id },
              { 'data.parentFolder': this.node._id }
            ]
          }
        })

        this.$q.notify({
          message: this.node.label + ' was permanently removed',
          position: 'bottom-left'
        })
      })
    }
  }
}
</script>
