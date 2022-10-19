<template>
  <q-page class="q-pa-md " id="t-main-body" @click.native="$root.clickedItem = $root.currentFolder">
    <!-- <new-menu></new-menu> -->
    <div class="text-body2 q-pb-md">Quick Access</div>
    <div class="row items-start q-gutter-md q-pb-md q-pr-md">
    </div>
    <div class="text-caption q-pb-md">Folders</div>
    <div class="row items-start q-gutter-md q-pb-md q-pr-md">
      <q-card bordered class="my-card col-xs-12 col-sm-6 col-md-4 no-shadow"
        v-for="folder in folders" :key="folder._id"
        v-show="folder.trash"
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
              <q-btn round flat class="bg-white q-mr-sm" color="blue-grey-14" size="sm" icon="folder"></q-btn>
              <!-- <q-icon name="folder" class="q-pr-sm" /> -->
              {{ folder.label }} {{ folder.trash }}
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
    <div class="row items-start q-gutter-md q-pb-md q-pr-md">
      <q-card bordered class="my-card col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 no-shadow"
        v-for="file in files" :key="file._id"
        v-show="file.trash"
        @click.native="$timeout(() => {
          $root.clickedItem = file
        }, 10)"
        :style="{
          'background-color': $root.clickedItem._id === file._id ? '#E1F5FE' : 'white'
        }"
      >
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
        <div v-else class="row justify-center bg-blue-grey-1">
          <q-icon v-if="file.type && file.type === 'doc'" name="fas fa-file-alt" size="64px" color="blue-grey-3" class="q-pt-md q-pb-md thumbnail" />
          <q-icon v-else-if="file.type && file.type === 'form'" name="fas fa-file-signature" size="64px" color="blue-grey-3" class="q-pt-md q-pb-md thumbnail" />
          <q-icon v-else name="fas fa-file" size="64px" color="blue-grey-3" class="q-pt-md q-pb-md thumbnail" />
        </div>

        <q-card-section style="max-height: 56px;" class="row items-center no-wrap">
          <div class="col text-weight-regular limited-text" :class="{
              'text-primary': $root.clickedItem._id === file._id,
              'text-blue-grey-14': $root.clickedItem._id !== file._id
            }">
            <q-btn v-if="file.type && file.type === 'doc'" icon="fas fa-file-alt" round flat class="bg-white q-mr-sm" color="blue" size="sm"></q-btn>
            <q-btn v-else-if="file.type && file.type === 'form'" icon="fas fa-file-signature" round flat class="bg-white q-mr-sm" color="purple" size="sm"></q-btn>
            <q-btn v-else-if="file.versions && $lodash.isImage(currentVersion(file).fileName)" icon="photo_size_select_actual" round flat class="bg-white q-mr-sm" color="red" size="sm"></q-btn>
            <q-btn v-else-if="file.versions && $lodash.isVideo(currentVersion(file).fileName)" icon="videocam" round flat class="bg-white q-mr-sm" color="red" size="sm"></q-btn>
            <q-btn v-else-if="file.versions && $lodash.isAudio(currentVersion(file).fileName)" icon="volume_up" round flat class="bg-white q-mr-sm" color="red" size="sm"></q-btn>
            <q-btn v-else icon="fas fa-file" round flat class="bg-white q-mr-sm" color="blue" size="sm"></q-btn>
            <!-- <q-icon name="folder" class="q-pr-sm" /> -->
            {{ file.label }}
          </div>
          <!-- <div class="text-weight-light text-blue-grey-13">by John Doe</div> -->
          <div class="col-auto">
              <q-btn color="grey-7" size="sm" round flat icon="more_vert" >
                <node-menu :node="file"></node-menu>
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
  height: 104px;
  overflow: hidden;
}
.thumbnail > img, video {
  position: absolute;
  left: 50%;
  top: 50%;
  height: 100%;
  width: auto;
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

// import newMenu from 'components/newMenu.vue'
import nodeMenu from 'components/trashMenu.vue'

export default {
  name: 'PageIndex',
  components: {
    // newMenu,
    nodeMenu
  },
  data: () => ({
    folderListner: null,
    fileListner: null,
    listKey: Date.now(),
    foldersSrvc: null,
    filesSrvc: null,
    onAuth: null,
    folders: [],
    files: []
  }),
  beforeDestroy () {
    this.foldersSrvc.destroy()
    this.filesSrvc.destroy()
    this.$dbCon.removeListener('authenticated', this.onAuth)
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
      })

    this.onAuth = async (res) => {
      delete res.user.training_programs
      delete res.user.voluntary_work
      delete res.user.work_experience
      delete res.user.civil_service_eligibility
      delete res.user.educational_background
      delete res.user.family_background
      delete res.user.other_information
      delete res.user.extra_information.signature
      this.$root.user = res.user
      console.log('LOGGED IN')
      this.getFoldersAndFiles()
    }
    console.log('this.onAuth', this.onAuth)
    if (this.$root.user) this.getFoldersAndFiles()
    this.$dbCon.on('authenticated', this.onAuth)
  },
  methods: {
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
    getFoldersAndFiles () {
      // let $elemMatch = { 'value._id': this.$root.user._id }
      let params = {
        query: {
          trash: true,
          owner: this.$root.user._id,
          $limit: 500
        }
      }

      let config = {
        debug: true,
        channels: [
          {
            value: this.$root.user._id, // owner: this.$root.user._id
            prop: 'owner'
          }
        ]
      }

      this.foldersSrvc.reset(params, config)
      this.filesSrvc.reset(params, config)
    }
  }
}
</script>
