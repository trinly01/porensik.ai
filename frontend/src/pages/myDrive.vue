<template>
  <q-page @drop.prevent @dragover.prevent="openNewMenuUpload($event)" ref="container" class="q-pa-md " id="t-main-body" @click.native="$root.clickedItem = $root.currentFolder">
    <!-- {{ this.$root.currentFolder }} -->
    <new-menu
      v-if="
        $root.user &&
        (
          this.$root.currentFolder._id === 'My Drive' ||
          this.$root.currentFolder.owner === $root.user._id ||
          $lodash.findIndex(this.$root.currentFolder.security.uploaders, user => user.value._id === $root.user._id) > -1
        )
      "
     ref="nMenu"></new-menu>
    <div class="row q-pb-md items-center q-gutter-sm">
      <div class="col text-caption">Folders</div>
      <q-select hide-dropdown-icon dense options-dense class="text-caption" borderless v-model="$root.sort.value" :options="$root.sort.options"/>
      <q-btn @click="$root.sort.desc = !$root.sort.desc"  :icon="`fas fa-sort-amount-${$root.sort.desc ? 'down-alt': 'up'}`" color="blue-grey" round flat size="xs"/>
    </div>
    <div class="row items-start q-gutter-md q-pb-md q-pr-md">
      <q-card bordered class="my-card col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 no-shadow"
        v-for="folder in sortedFolders" :key="folder._id" :id="folder._id"
        @dblclick.native="dblclick(folder)"
        @click.native="$timeout(() => {
          $root.clickedItem = folder
        }, 10)"
        :style="{
          'background-color': $root.clickedItem._id === folder._id ? '#E1F5FE' : 'white'
        }"
      >
        <q-card-section style="max-height: 56px;" class="row items-center no-wrap">
            <div class="col text-weight-regular limited-text" :class="{
              'text-primary': $root.clickedItem._id === folder._id,
              'text-blue-grey-14': $root.clickedItem._id !== folder._id
            }">
              <q-btn round flat class="bg-white q-mr-sm" color="blue-grey" size="sm" icon="folder"></q-btn>
              <!-- <q-icon name="folder" class="q-pr-sm" /> -->
              <span>
                {{ folder.label }}
                <q-tooltip v-if="folder.label.length > 25 || true">
                  {{ folder.label }}
                </q-tooltip>
              </span>
            </div>

            <div class="col-auto">
               <q-btn color="grey-7" size="sm" round flat icon="more_vert" >
                 <node-menu :node="folder"></node-menu>
               </q-btn>
            </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="row text-caption q-mt-md">Files</div>
    <q-list v-if="$root.listView" separator>
      <q-item v-for="file in sortedFiles" :key="file._id" :id="file._id"
      @dblclick="$refs['node-menu-'+file._id][0].open(file)"
      @click.native="$timeout(() => {
        $root.clickedItem = file
      }, 10)"
      clickable v-ripple :active="$root.clickedItem._id === file._id">
        <q-item-section avatar>
          <!-- <q-icon name="signal_wifi_off" /> -->
          <q-btn v-if="file.type && file.type === 'doc'" icon="fas fa-file-alt" round flat class="bg-white q-mr-sm" color="blue" size="sm"></q-btn>
            <q-btn v-else-if="file.type && file.type === 'form'" icon="fas fa-file-signature" round flat class="bg-white q-mr-sm" color="purple" size="sm"></q-btn>
            <q-btn v-else-if="file.versions && $lodash.isImage(currentVersion(file).fileName)" icon="photo_size_select_actual" round flat class="bg-white q-mr-sm" color="red" size="sm"></q-btn>
            <q-btn v-else-if="file.versions && $lodash.isVideo(currentVersion(file).fileName)" icon="videocam" round flat class="bg-white q-mr-sm" color="red" size="sm"></q-btn>
            <q-btn v-else-if="file.versions && $lodash.isAudio(currentVersion(file).fileName)" icon="volume_up" round flat class="bg-white q-mr-sm" color="red" size="sm"></q-btn>
            <q-btn v-else icon="fas fa-file" round flat class="bg-white q-mr-sm" color="blue" size="sm"></q-btn>
        </q-item-section>
        <q-item-section>{{ file.label }}</q-item-section>
        <q-item-section side>{{ $moment(file.logs[0].timestamp).format('ll') }}</q-item-section>
        <q-item-section side>
          <q-btn color="grey-7" size="sm" round flat icon="more_vert" >
            <node-menu :ref="'node-menu-'+file._id" :node="file"></node-menu>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
    <div v-else class="row items-start q-gutter-md q-pb-md q-pr-md">
      <q-card bordered class="my-card col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 no-shadow"
        v-for="file in sortedFiles" :key="file._id" :id="file._id"
        v-show="!file.trash && file.parentFolder === $route.params._id"
        @dblclick="$refs['node-menu-'+file._id][0].open(file)"
        @click.native="$timeout(() => {
          $root.clickedItem = file
        }, 10)"
        :style="{
          'background-color': $root.clickedItem._id === file._id ? '#E1F5FE' : 'white'
        }"
      >
        <!-- {{ file.versions[0].fileName }} -->
        <!-- <img v-else :src="`${$dbCon.io.io.uri}/uploads?_id=${file.versions[file.versions.length-1]._id}`" :height="150"> -->
        <div v-if="file.versions && $lodash.isImage(currentVersion(file).fileName)" class="thumbnail row justify-center bg-blue-grey-1">
          <img :key="file._id" :src="`${$dbCon.io.io.uri}/uploads?_id=${file._id}${
            file.security.public !== true ? '&t=' + $root.jwt : ''
          }`" class="portrait" alt="Image" />
        </div>
        <div v-else-if="file.versions && $lodash.isVideo(currentVersion(file).fileName)" class="thumbnail">
          <video controls class="thumbnail" preload="none">
            <source :src="`${$dbCon.io.io.uri}/uploads?_id=${file._id}${
              file.security.public !== true ? '&t=' + $root.jwt : ''
            }`">
            Your browser does not support the <code>video</code> tag.
          </video>
          <!-- <q-video
            :src="`${$dbCon.io.io.uri}/uploads?_id=${currentVersion(file)._id}`"
          /> -->
        </div>
        <div v-else-if="file.versions && $lodash.isAudio(currentVersion(file).fileName)" class="thumbnail bg-blue-grey-1">
          <audio
          class="q-pa-md"
          style="
            position: absolute;
            width: 100%;
            top: 32px;
          "
          controls preload="none">
            <source :src="`${$dbCon.io.io.uri}/uploads?_id=${currentVersion(file)._id}`">
            Your browser does not support the <code>audio</code> tag.
          </audio>
        </div>
        <div v-else class="row justify-center bg-blue-grey-1 thumbnail q-pt-md">
          <q-icon v-if="file.type && file.type === 'doc'" name="fas fa-file-alt" size="64px" color="blue-grey-3" class="q-pt-md q-pb-md" />
          <q-icon v-else-if="file.type && file.type === 'form'" name="fas fa-file-signature" size="64px" color="blue-grey-3" class="q-pt-md q-pb-md" />
          <q-icon v-else name="fas fa-file" size="64px" color="blue-grey-3" class="q-pt-md q-pb-md" />
        </div>

        <q-card-section style="max-height: 56px;" class="row items-center no-wrap">
          <div class="col text-weight-regular limited-text" :class="{
              'text-primary': $root.clickedItem._id === file._id,
              'text-blue-grey-14': $root.clickedItem._id !== file._id
            }">
            <!-- <q-btn round flat class="bg-white q-mr-sm" color="blue-grey-14" size="sm" :icon="file.type ? file.type === 'form' ? 'featured_play_list' : file.type === 'doc' ? 'fas fa-file-alt' : 'featured_play_list' : file.versions && $lodash.isImage(currentVersion(file).fileName) ? 'photo' : 'insert_drive_file'"></q-btn> -->
            <q-btn v-if="file.type && file.type === 'doc'" icon="fas fa-file-alt" round flat class="bg-white q-mr-sm" color="blue" size="sm"></q-btn>
            <q-btn v-else-if="file.type && file.type === 'form'" icon="fas fa-file-signature" round flat class="bg-white q-mr-sm" color="purple" size="sm"></q-btn>
            <q-btn v-else-if="file.versions && $lodash.isImage(currentVersion(file).fileName)" icon="photo_size_select_actual" round flat class="bg-white q-mr-sm" color="red" size="sm"></q-btn>
            <q-btn v-else-if="file.versions && $lodash.isVideo(currentVersion(file).fileName)" icon="videocam" round flat class="bg-white q-mr-sm" color="red" size="sm"></q-btn>
            <q-btn v-else-if="file.versions && $lodash.isAudio(currentVersion(file).fileName)" icon="volume_up" round flat class="bg-white q-mr-sm" color="red" size="sm"></q-btn>
            <q-btn v-else icon="fas fa-file" round flat class="bg-white q-mr-sm" color="blue" size="sm"></q-btn>
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
              <q-btn color="grey-7" size="sm" round flat icon="more_vert" >
                <node-menu :ref="'node-menu-'+file._id" :node="file"></node-menu>
              </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style>
.my-card {
  width: 100%;
  max-width: 250px;
  min-width: 228px;
}
.limited-text {
  white-space: nowrap;
  /* max-width: 1000px; */
  overflow: hidden;
  text-overflow: ellipsis;
}

.thumbnail {
  position: relative;
  /* width: 200px; */
  height: 136px;
  overflow: hidden;
}
.thumbnail > img, video {
  position: absolute;
  left: 50%;
  top: 50%;
  height: 100%;
  width: 100%;
  -webkit-transform: translate(-50%,-50%);
      -ms-transform: translate(-50%,-50%);
          transform: translate(-50%,-50%);
}
.thumbnail > img.portrait, video.portrait {
  width: 100%;
  height: auto;
}
</style>

<script>

import newMenu from 'components/newMenu.vue'
import nodeMenu from 'components/nodeMenu.vue'

export default {
  name: 'PageIndex',
  components: {
    newMenu,
    nodeMenu
  },
  computed: {
    sortedFolders () {
      return this.$lodash.orderBy(this.folders, folder => {
        let option = {
          'Name': folder.label.toLowerCase(),
          'Last modified': folder.logs[folder.logs.length - 1].timestamp,
          'Date created': folder.logs[0].timestamp
        }
        return [option[this.$root.sort.value]]
      }, [this.$root.sort.desc ? 'desc' : 'asc'])
    },
    sortedFiles () {
      return this.$lodash.orderBy(this.files, folder => {
        let option = {
          'Name': folder.label.toLowerCase(),
          'Last modified': folder.logs[folder.logs.length - 1].timestamp,
          'Date created': folder.logs[0].timestamp
        }
        // console.log('option[this.$root.sort.value]', this.$root.sort.desc)
        return [option[this.$root.sort.value]]
      }, [this.$root.sort.desc ? 'desc' : 'asc'])
    }
  },
  data () {
    return {
      foldersSrvc: null,
      filesSrvc: null,
      onAuth: null,
      folders: [],
      files: []
    }
  },
  watch: {
    async $route (to, from) {
      this.getFoldersAndFiles()
    }
  },
  beforeDestroy () {
    this.foldersSrvc.destroy()
    this.filesSrvc.destroy()
    this.$dbCon.removeListener('authenticated', this.onAuth)
    // if (this.$root.user) console.log('this.foldersSrvc', this.foldersSrvc)
  },
  mounted () {
    this.foldersSrvc = this.$dbCon.wingsService('juan-folders')
      .on('dataChange', folders => {
        this.folders = folders
        console.log('folders', folders)
      })
    this.filesSrvc = this.$dbCon.wingsService('juan-files')
      .on('dataChange', files => {
        this.files = files
        if (this.$route.query.f) {
          let i = this.$lodash.findIndex(this.files, { _id: this.$route.query.f })
          if (i > -1) {
            this.$root.clickedItem = this.files[i]
            setTimeout(() => {
              let el = document.getElementById(this.$route.query.f)
              console.log('mounted')
              if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
            }, 1000)
            // console.log('container', document.getElementById(this.files[i]._id))
            // var topPos = document.getElementById(this.files[i]._id).offsetTop
            // console.log('container', this.$refs.container, topPos)
            // document.getElementById('t-main-body').scrollTop = topPos
            // this.$refs.container.$el.scrollTop = topPos
          }
        }
      })

    this.onAuth = async (res) => {
      this.$root.path = []
      delete res.user.training_programs
      delete res.user.voluntary_work
      delete res.user.work_experience
      delete res.user.civil_service_eligibility
      delete res.user.educational_background
      delete res.user.family_background
      delete res.user.other_information
      delete res.user.extra_information.signature
      this.$root.user = res.user
      console.log('AUTH OY!')
      this.getFoldersAndFiles()
    }

    if (this.$root.user) this.getFoldersAndFiles()
    this.$dbCon.on('authenticated', this.onAuth)
  },
  methods: {
    async openNewMenuUpload (e) {
      // let nMenu = this.$refs.nMenu.$children[0]
      // console.log(nMenu)
      // nMenu.show(e)
      this.$refs.nMenu.newFile()
      // nMenu.toggle()
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
      file.versions[index].fileName = file.versions[index].fileName || ''
      return file.versions[index]
    },
    async dblclick (node) {
      this.$router.push('/myDrive/' + node._id)
      // await this.$dbCon.services['juan-folders'].reQuery({
      //   query: {
      //     parentFolder: node._id,
      //     trash: {
      //       $ne: true
      //     }
      //   }
      // })
      this.$root.currentFolder = node
      this.$root.clickedItem = node
    },
    checkSecurity (sec) {
      return sec.public ||
        this.$lodash.findIndex(sec.viewers, user => user.value._id === this.$root.user._id) > -1 ||
        this.$lodash.findIndex(sec.uploaders, user => user.value._id === this.$root.user._id) > -1 ||
        this.$lodash.findIndex(sec.modifiers, user => user.value._id === this.$root.user._id) > -1 ||
        this.$lodash.findIndex(sec.removers, user => user.value._id === this.$root.user._id) > -1 ||
        this.$lodash.findIndex(sec.folderCreators, user => user.value._id === this.$root.user._id) > -1 ||
        this.$lodash.findIndex(sec.approvers, user => user.value._id === this.$root.user._id) > -1
    },
    getParamsConfig () {
      const condition = {
        $sort: {
          'logs.timestamp': -1
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
      const channels = [
        {
          value: (parentFolder, node) => {
            let con = (
              node.owner === this.$root.user._id &&
              parentFolder === this.$route.params._id &&
              !node.trash
            )
            console.log('con 1', con)
            return con
          }, // owner: this.$root.user._id
          prop: 'parentFolder'
        },
        {
          value: (security, node) => {
            let con = (
              this.checkSecurity(security) &&
              node.parentFolder === this.$route.params._id &&
              !node.trash
            )
            console.log('con 2', con)
            return con
          }, // owner: this.$root.user._id
          prop: 'security'
        }
        // {
        //   value: (security, folder) => { // Channel name
        //     // console.log('security.viewers', security.viewers, folder.parentFolder)
        //     return (
        //       this.checkSecurity(security) &&
        //       folder.parentFolder === this.$route.params._id
        //     )
        //   },
        //   prop: 'security' // record or data property
        // }
      ]

      let params = {
        query: {
          $limit: 500,
          parentFolder: this.$route.params._id,
          ...condition,
          $or
        }
      }

      let config = {
        debug: true,
        channels,
        newDataPosition: 'start'
      }

      return { params, config }
    },
    async getPath (node) {
      this.$root.path.unshift({
        label: node.label,
        _id: node._id
      })

      console.log('this.$root.path', this.$root.path)

      try {
        const p = await this.$dbCon.service('juan-folders').get(node.parentFolder)
        await this.getPath(p)
      } catch (error) {
        if (node._id !== 'My Drive') {
          this.$root.path.unshift({
            label: 'My Drive',
            _id: 'My Drive'
          })
        }
      }
    },
    async rePath () {
      this.$root.path = []
      let paramsId = this.$route.params._id
      if (paramsId === 'My Drive') {
        this.$root.currentFolder = this.$root.nodeFormat
        this.$root.clickedItem = this.$root.nodeFormat
        this.$root.path = [{
          label: 'My Drive',
          _id: 'My Drive'
        }]
      } else {
        this.$root.currentFolder = await this.$dbCon.services['juan-folders'].get(paramsId)
        await this.getPath(this.$root.currentFolder)
        // restriction based on security or user is Not Authorized to open
        if (!this.checkSecurity(this.$root.currentFolder.security) &&
        this.$root.currentFolder.owner !== this.$root.user._id) {
          this.$router.push('/unauthorized')
        }
      }
    },
    async getFoldersAndFiles () {
      console.log('getFoldersAndFiles')
      let { params, config } = this.getParamsConfig()
      this.foldersSrvc.reset(params, config)
      this.filesSrvc.reset(params, config)
      await this.rePath()
    }
  }
}
</script>
