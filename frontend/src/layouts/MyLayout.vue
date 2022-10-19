<template>
  <q-layout view="lHh LpR lfr">
    <q-header bordered class="bg-white">
      <div class="row">
        <q-toolbar v-if=" !leftDrawerOpen" class="text-blue-grey-10" style="width: 256px;">
          <q-btn
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            aria-label="Menu"
          >
            <q-icon name="menu" />
          </q-btn>

          <q-toolbar-title>
            {{ title }}
          </q-toolbar-title>

          <!-- <div>Quasar v{{ $q.version }}</div> -->
        </q-toolbar>
        <q-toolbar class="bg-white text-blue-grey-10 col q-header--bordered" style="height: 51px; height: 64px;">
          <div class="col" style="position: relative; right: 14px;">
            <search-input />
          </div>
          <q-btn
            aria-label="Menu"
            flat
            round
            icon="notifications"
            color="blue-grey-14"
            :disabled="$root.notifs && !$root.notifs.length"
          >
            <q-badge color="red" floating transparent
              v-show="$root.newNotifs"
              style="position: absolute; top: 4px;"
            >
              {{ $root.newNotifs }}
            </q-badge>
            <q-popup-proxy>
              <q-infinite-scroll @load="loadMore" :offset="8">
                <q-list bordered separator style="min-width: 300px;">
                  <q-item
                    clickable
                    v-ripple
                    v-for="(notif, i) in $root.notifs"
                    :key="notif._id"
                    :class="{
                      'bg-light-blue-1': !notif.seen
                    }"
                    @click="seeNotif(notif)"
                    v-show="!!notif.data"
                    v-close-popup
                  >
                  <!-- v-show="!!notif.data" -->
                    <q-item-section v-if="!!notif.data">
                      <q-item-label>
                        <b>{{ notif.from.personal_information.first_name }} {{ notif.from.personal_information.surname }}</b>
                        <!-- viewers: [],
                        uploaders: [],
                        modifiers: [],
                        removers: [],
                        folderCreators: [] -->
                        {{ notif.action }} <i>{{ notif.data.label }}</i> {{ notif.data.isFolder ? 'folder' : 'file' }}
                      </q-item-label>
                      <q-item-label caption :key="i+currentTime">{{ $moment(notif.timestamp).fromNow() }}</q-item-label>
                    </q-item-section>
                    <!-- <q-item-side>
                      <q-btn round size="sm" icon="close"></q-btn>
                    </q-item-side> -->
                  </q-item>
                  <!-- <q-item clickable class="row justify-center">
                    <div>
                      Load more...
                    </div>
                  </q-item> -->
                </q-list>
              <template v-slot:loading>
                  <div v-if="notifsSrvc.data.length < notifsSrvc.total" class="row justify-center q-my-md">
                    <q-spinner-dots color="primary" size="40px" />
                  </div>
                </template>
              </q-infinite-scroll>
            </q-popup-proxy>
          </q-btn>
          <!-- v-if="!!$root.user" -->
          <q-btn
            v-if="!$root.user"
            flat
            label="Login"
            @click="loginDialogOpen = true"
          >
            <q-dialog v-model="loginDialogOpen" persistent>
              <q-card style="min-width: 400px">
                <q-card-section>
                  <div class="text-h6">Sign in</div>
                </q-card-section>

                <q-card-section>
                  <q-input label="ID. #" v-model="loginCredentials.id" autofocus @keyup.enter="login" @focus="$event.target.select()" />
                  <q-input label="Password" type="password" v-model="loginCredentials.password" @keyup.enter="login" @focus="$event.target.select()" />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="Manage Account" @click="manageAccount" />
                  <q-btn :loading="loading" color="primary" label="Login" @click="login" />
                  <!-- <q-btn color="primary" label="Create" @click="saveFolder" /> -->
                </q-card-actions>
              </q-card>
            </q-dialog>
          </q-btn>
          <!-- {{$root.user}} -->
          <q-btn
            class="q-ml-md"
            size="md"
            v-if="!!$root.user"
            round
            @click="loginDialogOpen = true"
          >
            <q-avatar size="40px" :color="!!$root.user.img ? 'teal' : ''" text-color="white">
              <img :key="'avatar'+$root.user.img" v-show="!$root.user.img" :src="`http://10.10.120.3/images/employeeImages/${$root.user.emp_id}.jpg`" @error="error => {
                $root.user.img = true
                $forceUpdate()
              }" />
              {{ !!$root.user.img ? $root.user.personal_information.first_name.charAt(0) : '' }}
              <!-- <img v-show="!!$root.user.img" src="~assets/sad.svg" @error="error => {
                $root.user.img = true
                $forceUpdate()
              }" /> -->
            </q-avatar>
            <q-popup-proxy>
              <div class="row no-wrap q-pa-md" style="width: 300px;">
                  <q-avatar size="72px">
                    <img v-if="!!$root.user" v-show="!$root.user.img" :src="`http://10.10.120.3/images/employeeImages/${$root.user.emp_id}.jpg`" @error="error => {
                      $root.user.img = true
                      $forceUpdate()
                    }" />
                    <img v-show="!!$root.user.img" src="~assets/sad.svg" @error="error => {
                      $root.user.img = true
                      $forceUpdate()
                    }" />
                  </q-avatar>
                  <div class="column q-pl-md">
                    <div class="text-subtitle2">{{ $root.user.personal_information.first_name }} {{ $root.user.personal_information.surname }}</div>
                    <div class="text-body">{{ $root.user.personal_information.email }}</div>
                    <div class="row q-pt-md">
                      <q-btn size="xs" class="col-auto" flat color="primary" @click="manageAccount" >Manage Account</q-btn>
                      <q-btn size="xs" class="pull-right" flat color="negative" @click="$dbCon.logout">Logout</q-btn>
                    </div>
                  </div>
              </div>
            </q-popup-proxy>
          </q-btn>
        </q-toolbar>
        <q-toolbar class="text-blue-grey-10">
          &nbsp; &nbsp; &nbsp;
          <q-breadcrumbs class="text-primary" active-color="blue-grey-10">
            <template v-slot:separator>
              <q-icon
                size="1.5em"
                name="chevron_right"
                color="primary"
              />
            </template>

            <q-breadcrumbs-el v-if="$route.path === '/trash'" label="Trash" />
            <q-breadcrumbs-el v-else-if="$route.path === '/shared'" label="Shared with me" />
            <q-breadcrumbs-el v-else-if="$route.path === '/'" label="Welcome" />
            <q-breadcrumbs-el v-else v-for="(folder, i) in $root.path" :key="i" :label="folder.label" :to="'/myDrive/' + folder._id" />
            <!-- <q-breadcrumbs-el label="Components" icon="widgets" />
            <q-breadcrumbs-el label="Breadcrumbs" icon="navigation" /> -->
          </q-breadcrumbs>
          <q-space />
          <q-btn class="q-mr-sm" flat dense round icon="list" size="md" @click="$root.listView = !$root.listView"
            :color="$root.listView ? 'primary' : ''"
          ></q-btn>
          <q-btn flat dense round icon="info_outline" size="md"
            @click="rightDrawerOpen = !rightDrawerOpen"
            :color="rightDrawerOpen ? 'primary' : ''"
            :style="{
              'background-color': rightDrawerOpen ? '#E1F5FE' : ''
            }"
          ></q-btn>
        </q-toolbar>
      </div>
    </q-header>

    <q-drawer
      :width="256"
      v-model="leftDrawerOpen"
      content-class="white"
      side="left"
    >
      <div class="absolute-top"  style="height: 130px;">
        <q-toolbar class="text-blue-grey-10 q-header--bordered" outlined style="height: 64px;" >
          <q-btn
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            aria-label="Menu"
          >
            <q-icon name="menu" />
          </q-btn>

          <q-toolbar-title>
            {{ title }}
          </q-toolbar-title>

          <!-- <div>Quasar v{{ $q.version }}</div> -->
        </q-toolbar>
        <q-btn rounded class="q-ma-md"
          :disabled="
            !(
              $root.user &&
              $route.path.split('/')[1] === 'myDrive' &&
              (
                this.$root.currentFolder._id === 'My Drive' ||
                this.$root.currentFolder.owner === $root.user._id ||
                $lodash.findIndex(this.$root.currentFolder.security.uploaders, user => user.value._id === $root.user._id) > -1
              )
            )
          "
        >
          <q-icon left size="3em" name="add" color="secondary" />
          <div>New &nbsp;</div>
          <new-menu :leftClick="true"></new-menu>
        </q-btn>
      </div>
      <q-scroll-area style="height: calc(100% - 130px); margin-top: 130px; border-right: 1px solid #ddd;" class="no-border q-pt-sm">
        <!-- {{ selectedPath }} -->
        <q-tree class=""
          :nodes="nodes"
          accordion
          node-key="_id"
          :selected.sync="selectedPath"
          @lazy-load="onLazyLoad"
          @update:selected="onFolderSelection"
        />
        <q-list class="menu-list" >
          <!-- <q-separator class="q-ma-sm" /> -->

          <!-- <q-item clickable>
            <q-item-section avatar>
              <q-icon name="edit" color="blue-grey" class="q-pl-md" />
            </q-item-section>
            <q-item-section>
              <q-item-label>For actions</q-item-label>
              <q-item-label caption>Public folders and files</q-item-label>
            </q-item-section>
          </q-item> -->

          <q-separator class="q-ma-sm" />

          <q-item clickable to="/shared" @click="selectedPath = ''">
            <q-item-section avatar>
              <q-icon name="group" color="blue-grey" class="q-pl-md" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Shared with me</q-item-label>
              <!-- <q-item-label caption>Public folders and files</q-item-label> -->
            </q-item-section>
          </q-item>

          <!-- <q-item clickable>
            <q-item-section avatar>
              <q-icon name="access_time" color="blue-grey" class="q-pl-md" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Recent</q-item-label>
              <q-item-label caption>Public folders and files</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="star_border" color="blue-grey" class="q-pl-md" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Starred</q-item-label>
              <q-item-label caption>Public folders and files</q-item-label>
            </q-item-section>
          </q-item> -->
          <q-item clickable to="/trash" @click="selectedPath = ''">
            <q-item-section avatar>
              <q-icon name="delete_outline" color="blue-grey" class="q-pl-md" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Trash</q-item-label>
              <!-- <q-item-label caption>Public folders and files</q-item-label> -->
            </q-item-section>
          </q-item>
          <!-- <q-item-label header>Essential Links</q-item-label> -->
          <!-- <q-item clickable tag="a" target="_blank" href="http://v1.quasar-framework.org">
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Docs</q-item-label>
              <q-item-label caption>v1.quasar-framework.org</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://github.com/quasarframework/">
            <q-item-section avatar>
              <q-icon name="code" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Github</q-item-label>
              <q-item-label caption>github.com/quasarframework</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="http://chat.quasar-framework.org">
            <q-item-section avatar>
              <q-icon name="chat" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Discord Chat Channel</q-item-label>
              <q-item-label caption>chat.quasar-framework.org</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://forum.quasar-framework.org">
            <q-item-section avatar>
              <q-icon name="record_voice_over" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Forum</q-item-label>
              <q-item-label caption>forum.quasar-framework.org</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://twitter.com/quasarframework">
            <q-item-section avatar>
              <q-icon name="rss_feed" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Twitter</q-item-label>
              <q-item-label caption>@quasarframework</q-item-label>
            </q-item-section>
          </q-item> -->
        </q-list>
      </q-scroll-area>
      <q-list class="menu-list absolute-bottom" style="bottom: 8px;" >
          <q-item clickable class="bg-grey-12" @click="showDigiSigner">
            <q-item-section avatar>
              <q-icon name="fas fa-pen-nib" color="primary" class="q-pl-md" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-primary">DigiSigner</q-item-label>
              <!-- <q-item-label caption>Public folders and files</q-item-label> -->
            </q-item-section>
          </q-item>
        </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <q-toolbar class="text-blue-grey-10">
        <q-btn flat round dense icon="menu" color="blue-grey" />
        <q-toolbar-title>
          {{ $root.clickedItem.label }}
        </q-toolbar-title>
        <q-btn flat round dense icon="close" color="blue-grey" @click="rightDrawerOpen = !rightDrawerOpen" />
      </q-toolbar>
      <q-tabs
        class="text-blue-grey q-pl-md q-pr-md"
        active-color="primary"
        v-model="tab"
      >
        <q-tab name="details" label="Details" />
        <q-tab name="activity" label="Activity" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="details">
          <div class="row justify-center">
            <div>
              <q-icon name="folder_open" size="120px" color="blue-grey" />
            </div>
          </div>
          <q-separator v-if="$root.clickedItem && $root.clickedItem._id !== 'My Drive'" style="position: relative; right: 16px;" />
          <q-list dense v-if="$root.clickedItem && $root.clickedItem._id !== 'My Drive'" class="q-pt-md">
            <q-item>
              <q-item-section>
                <q-item-label>Type</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>{{ $root.clickedItem.isFolder ? 'Folder' : 'File' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>Creator</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label v-if="$root.clickedItem.logs[0]" caption> {{ $root.clickedItem.logs[0].user.personal_information.first_name }} {{ $root.clickedItem.logs[0].user.personal_information.surname }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="$root.clickedItem.logs.length > 1">
              <q-item-section>
                <q-item-label>Modified</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>{{ $moment($root.clickedItem.logs[$root.clickedItem.logs.length-1].timestamp).format('lll') }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="!!$root.clickedItem.opened">
              <q-item-section>
                <q-item-label>Opened</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>{{ $moment($root.clickedItem.opened.timestamp).format('lll') }} by {{ $root.clickedItem.opened.user.personal_information.first_name }} {{ $root.clickedItem.opened.user.personal_information.surname }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>Created</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>{{ $moment($root.clickedItem.logs[0].timestamp).format('lll') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <div>
            <q-select
              v-if="!!$root.clickedItem.security.viewers"
              v-model="$root.clickedItem.security.viewers"
              label="View"
              multiple
              use-chips
              readonly
            />
            <q-select
              v-if="!!$root.clickedItem.security.uploaders"
              v-model="$root.clickedItem.security.uploaders"
              label="Upload"
              multiple
              use-chips
              use-input
              readonly
            />
            <q-select
              v-if="!!$root.clickedItem.security.modifiers"
              v-model="$root.clickedItem.security.modifiers"
              label="Modify"
              multiple
              use-chips
              use-input
              readonly
            />
            <q-select
              v-if="!!$root.clickedItem.security.removers"
              v-model="$root.clickedItem.security.removers"
              label="Remove"
              multiple
              use-chips
              use-input
              readonly
            />
            <q-select
              v-if="$root.clickedItem.isFolder && !!$root.clickedItem.security.folderCreators"
              v-model="$root.clickedItem.security.folderCreators"
              label="Create Folder"
              multiple
              use-chips
              use-input
              readonly
            />
            <q-select
              v-if="!$root.clickedItem.isFolder && !!$root.clickedItem.security.approvers"
              v-model="$root.clickedItem.security.approvers"
              label="Approvers"
              multiple
              use-chips
              use-input
              readonly
            />
          </div>
        </q-tab-panel>

        <q-tab-panel name="activity">
          <log-info v-model="logInfoDialogOpen" :json="logInfo" ></log-info>
          <q-list separator>
            <q-item @click="openLogInfo(log)" v-ripple clickable separator v-for="(log, i) in $lodash.reverse($root.clickedItem.logs)" :key="'log'+i">
              <q-item-section>
                <q-item-label>{{ log.action.charAt(0).toUpperCase() + log.action.slice(1) }}</q-item-label>
                <q-item-label caption lines="2">by {{ log.user.personal_information.first_name }} {{ log.user.personal_information.surname }}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>{{ $moment(log.timestamp).format('ll') }}</q-item-label>
                <!-- <q-icon name="star" color="yellow" /> -->
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </q-drawer>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import logInfo from 'components/logInfo.vue'
import newMenu from 'components/newMenu.vue'
import searchInput from 'components/searchInput.vue'

export default {
  components: { logInfo, newMenu, searchInput },
  name: 'MyLayout',
  beforeDestroy () {
    this.timer = null
    this.notifsSrvc.destroy()
    this.$dbCon.removeListener('authenticated', this.onAuth)
    // this.unseenSrvc.destroy()
  },
  mounted () {
    window.addEventListener('focus', () => {
      console.log('Focused')
      if (this.manageAccountWindow && !this.manageAccountWindow.closed) {
        this.manageAccountWindow.close()
        console.log(this.manageAccountWindow)
        this.manageAccount()
      }
      if (this.digiSignerWindow && !this.digiSignerWindow.closed) {
        this.digiSignerWindow.close()
        this.showDigiSigner()
      }
    })
    this.timer = setInterval(() => {
      this.currentTime = Date.now()
    }, 60000)
    this.$root.path = []
    // this.$dbCon.services['juan-notifs'].onDataChange(async (notifs, dataListnerIndex) => {
    //   console.log('notifs', notifs)
    //   this.$root.notifs = notifs
    //   this.$forceUpdate()
    // })
    this.$dbCon.on('logout', res => {
      // this.$axios.delete(`${this.$dbCon.io.io.uri}/authentication/${this.$root.jwt}`, {
      //   headers: {
      //     Authorization: this.$root.jwt
      //   }
      // })
      this.$root.user = false
      this.loginCredentials.password = ''
    })
    // this.unseenSrvc = this.$dbCon.wingsService('juan-notifs')
    // this.unseenSrvc.on('dataChange', unseenNotifs => (this.$root.newNotifs = this.unseenSrvc.total))
    this.notifsSrvc = this.$dbCon.wingsService('juan-notifs')
    console.log('this.notifsSrvc', this.notifsSrvc)
    this.notifsSrvc.on('dataChange', notifs => {
      let init = async () => {
        this.$root.newNotifs = (await this.$dbCon.services['juan-notifs'].find({
          query: {
            'to._id': this.$root.user._id,
            seen: false,
            $limit: 0
          }
        })).total
      }
      init()
      this.$root.notifs = notifs
      this.$forceUpdate()
    })
    this.$dbCon.authenticate()

    this.onAuth = async res => {
      console.log('TIMI AUTH ')
      if (this.reAuthTimer) clearInterval(this.reAuthTimer)
      this.reAuthTimer = setInterval(() => {
        this.$dbCon.authenticate({
          strategy: 'jwt',
          accessToken: this.$root.jwt
        }).then(() => {
          // this.$root.path = []
        })
        console.log('refreshed')
      }, (1000 * 60 * 15) - 5000) // 15 mins - 15 secs
      this.$root.jwt = window.localStorage.getItem(`${this.$dbCon.io.io.uri}-jwt`)
      delete res.user.training_programs
      delete res.user.voluntary_work
      delete res.user.work_experience
      delete res.user.civil_service_eligibility
      delete res.user.educational_background
      delete res.user.family_background
      delete res.user.other_information
      delete res.user.extra_information.signature
      this.$root.user = res.user
      this.loginDialogOpen = false
      this.loading = false
      this.getNotifs()
    }

    this.$dbCon.on('authenticated', this.onAuth)
    this.$dbCon.io.on('disconnect', () => {
      console.log('Hoy disconnected')
      this.$root.user = false
      this.loginDialogOpen = false
      this.loginCredentials.password = ''
    })
    this.$dbCon.io.on('connect', () => {
      this.$dbCon.authenticate()
    })
  },
  watch: {
    '$root.path': function (newD, old) {
      console.log('selectedPath', newD)
      if (newD.length) this.selectedPath = newD[newD.length - 1]._id
    },
    async $route (to, from) {
      // this.$root.path = []
      // this.getPath(this.$root.currentFolder)
    }
  },
  data () {
    return {
      title: 'Porensik.AI', // this.$host === 'http://10.10.120.15:3232' ? 'e-IMIS' : 'k-Resource', // 'rekord.ai',
      loading: false,
      notifsSrvc: null,
      logInfoDialogOpen: false,
      logInfo: '',
      currentTime: '',
      timer: null,
      tab: 'activity',
      leftDrawerOpen: this.$q.platform.is.desktop,
      rightDrawerOpen: true,
      loginDialogOpen: true,
      loginCredentials: {
        id: '',
        password: ''
      },
      nodes: [
        {
          label: 'My Drive',
          icon: 'donut_small',
          data: this.$root.nodeFormat,
          _id: 'My Drive',
          parent: 'My Drive',
          iconColor: 'blue-grey',
          lazy: true,
          handler: async (target) => {
            this.$router.push('/myDrive/' + target.data._id)
            // target.children = []
            // target.lazy = true

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

            const result = await this.$dbCon.wingsService('juan-folders').find({
              query: {
                $limit: 500,
                parentFolder: target.data._id,
                ...condition,
                $or
              }
            })
            target.children = result.data.map(folder => ({
              label: folder.label,
              lazy: true,
              data: folder,
              _id: folder._id
            }))

            this.$forceUpdate()
          }
        }
      ],
      selectedPath: 'public',
      currentPath: 'public'
    }
  },
  methods: {
    showDigiSigner () {
      this.digiSignerWindow = window.open('https://www.digisigner.com/online/', '', 'menubar=no, toolbar=no, location=no, status=no, scrollbars=no, resizable=no, dependent')
    },
    manageAccount () {
      this.manageAccountWindow = window.open('http://10.10.120.32:3536', '', 'menubar=no, toolbar=no, location=center, status=no, scrollbars=no, resizable=no, dependent')
    },
    openURL,
    console: console.log,
    getNotifs () {
      this.notifsSrvc.reset({
        query: {
          $sort: {
            'timestamp': -1
          },
          $or: [
            { 'to._id': this.$root.user._id }
          ]
        }
      }, {
        channels: [
          {
            value: this.$root.user._id, // owner: this.$root.user._id
            prop: 'to._id'
          }
        ],
        debug: false,
        newDataPosition: true
      })
    },
    getTrashData () {
      this.$dbCon.services['juan-folders'].reQuery({
        query: {
          owner: this.$root.user._id,
          trash: true
        }
      })
      console.log('SERVICE CHANNEL', this.$dbCon.services['juan-folders'])
      this.$dbCon.services['juan-files'].reQuery({
        query: {
          owner: this.$root.user._id,
          trash: true
        }
      })
    },
    async getSharedData () {
      let $elemMatch = {
        'value._id': this.$root.user._id
      }
      let qry = {
        query: {
          $or: [
            { 'security.viewers': { $elemMatch } },
            { 'security.uploaders': { $elemMatch } },
            { 'security.modifiers': { $elemMatch } },
            { 'security.removers': { $elemMatch } },
            { 'security.folderCreators': { $elemMatch } },
            { 'security.approvers': { $elemMatch } }
          ]
        },
        channels: [
          {
            value: (security, folder) => { // Channel name
              // console.log('security.viewers', security.viewers, folder.parentFolder)
              return (
                (security.public ||
                this.$lodash.findIndex(security.viewers, user => user.value._id === this.$root.user._id) > -1 ||
                this.$lodash.findIndex(security.uploaders, user => user.value._id === this.$root.user._id) > -1 ||
                this.$lodash.findIndex(security.modifiers, user => user.value._id === this.$root.user._id) > -1 ||
                this.$lodash.findIndex(security.removers, user => user.value._id === this.$root.user._id) > -1 ||
                this.$lodash.findIndex(security.folderCreators, user => user.value._id === this.$root.user._id) > -1 ||
                this.$lodash.findIndex(security.approvers, user => user.value._id === this.$root.user._id) > -1) &&
                folder.parentFolder === this.$route.params._id
              )
            },
            prop: 'security' // record or data property
          }
        ]
      }

      await this.$dbCon.services['juan-folders'].reQuery(qry)
      this.$dbCon.services['juan-files'].reQuery(qry)
    },
    async reQuery () {
      console.log('AUTH PATH', this.$route.path)
      this.getNotifs()
      if (this.$route.path === '/trash') {
        console.log('ROUTE', '/trash')
        this.getTrashData()
      } else if (this.$route.path === '/shared') {
        this.getSharedData()
      } else {
        console.log('reQUERY ELSE')
        // await this.getCurrentFolderAndReQuery()
        // this.getPath(this.$root.currentFolder)
      }
      if (this.$route.query.f) {
        console.log('HOOOY FILE DITO')
        let i = this.$lodash.findIndex(this.$root.files, { _id: this.$route.query.f })
        this.$root.clickedItem = this.$root.files[i]
      }
    },
    openLogInfo (log) {
      // console.log('TRINMAR HOYASDASD ASDASD' + log)
      if (!this.$lodash.isEmpty(log.data)) {
        this.logInfoDialogOpen = true
        let cloned = this.$filterObject(this.$lodash.cloneDeep(log.data), [
          'gender',
          'birthday',
          'birth_place',
          'height',
          'weight',
          'citizenship',
          'blood_type',
          'gsis',
          'pag_ibig',
          'philhealth',
          'sss',
          'cellphone_no',
          'civil_status',
          'permanent_address',
          'permanent_address_telephone_no',
          'permanent_address_zip_code',
          'residential_address',
          'residential_address_telephone_no',
          'residential_address_zip_code',
          'telephone_no',
          'tin',
          'roles',
          'password'
        ])
        console.log(cloned)
        this.logInfo = JSON.stringify(cloned)
        // console.log('CODe', this.logInfo)
      }
    },
    seeNotif (notif) {
      if (notif.data.isFolder) {
        this.$router.push('/myDrive/' + notif.data._id)
      } else {
        this.$router.push('/myDrive/' + notif.data.parentFolder + '?f=' + notif.data._id)
      }
      this.$dbCon.services['juan-notifs'].patch(notif._id, { seen: true })
    },
    async loadMore (index, done) {
      if (this.notifsSrvc.data.length < this.notifsSrvc.total) {
        setTimeout(async () => {
          console.log('loadMore', this.notifsSrvc)
          await this.notifsSrvc.loadMore()
          done()
        }, 3000)
      }
    },
    login () {
      this.loading = true
      console.log('login', this.loginCredentials.id + '@mail.com', this.loginCredentials.password)
      this.$dbCon.authenticate({
        strategy: 'sso',
        email: this.loginCredentials.id + '@mail.com',
        password: this.loginCredentials.password
      }).catch((e) => {
        console.error(e)
        this.loading = false
        this.$q.notify({
          message: 'Your ID or password is incorrect',
          position: 'bottom',
          color: 'negative'
        })
      })
    },
    clearPath () { this.$root.path = [] },
    // async getPath (node) {
    //   // if (node._id !== 'My Drive' || node.parentFolder !== 'My Drive') {
    //   this.$root.path.unshift({
    //     label: node.label,
    //     _id: node._id
    //   })

    //   try {
    //     const p = await this.$dbCon.services['juan-folders'].get(node.parentFolder)
    //     await this.getPath(p)
    //   } catch (error) {
    //     if (node._id !== 'My Drive') {
    //       this.$root.path.unshift({
    //         label: 'My Drive',
    //         _id: 'My Drive'
    //       })
    //     }
    //   }
    // },
    async getCurrentFolderAndReQuery () {
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
          value: this.$route.params._id, // owner: this.$root.user._id
          prop: 'parentFolder'
        },
        {
          value: this.$root.user._id, // owner: this.$root.user._id
          prop: 'owner'
        },
        {
          value: (security, folder) => { // Channel name
            // console.log('security.viewers', security.viewers, folder.parentFolder)
            return (
              this.checkSecurity(security) &&
              folder.parentFolder === this.$route.params._id
            )
          },
          prop: 'security' // record or data property
        }
      ]
      this.$root.global = { condition, $or, channels }
      try {
        this.$root.currentFolder = await this.$dbCon.services['juan-folders'].get(this.$route.params._id)
        if (this.$root.user && // restriction based on security or user is Not Authorized to open
        !this.checkSecurity(this.$root.currentFolder.security) &&
        this.$root.currentFolder.owner !== this.$root.user._id) {
          this.$router.push('/unauthorized')
        }
        let qry = {
          query: {
            $limit: 500,
            parentFolder: this.$route.params._id,
            ...condition,
            $or
          },
          channels
        }
        this.$dbCon.services['juan-folders'].reQuery(qry, { action: 'update' })
        await this.$dbCon.services['juan-files'].reQuery(qry, { action: 'update' })
        // May 24
      } catch (error) {
        this.$root.currentFolder = this.$root.nodeFormat
        this.$root.clickedItem = this.$root.nodeFormat
        let qry = {
          query: {
            $limit: 500,
            parentFolder: 'My Drive',
            ...condition,
            $or
          },
          channels
        }
        this.$dbCon.services['juan-folders'].reQuery(qry, { action: 'patch' })
        await this.$dbCon.services['juan-files'].reQuery(qry, { action: 'patch' })
      }

      // if (this.$root.path.length) {
      //   this.$root.path = []
      //   await this.getPath(this.$root.currentFolder)
      //   await this.$forceUpdate()
      //   console.log('path TRIN', this.$root.path)
      // }
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
    onFolderSelection (node) {
      console.log('path', node)
    },
    onLazyLoad ({ node, key, done, fail }) {
      // console.log('test', node)
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

      setTimeout(async () => {
        try {
          const result = await this.$dbCon.services['juan-folders'].find({
            query: {
              $limit: 500,
              parentFolder: node.data._id,
              ...condition,
              $or
            }
          })

          done(this.$lodash.orderBy(result.data.map(folder => ({
            label: folder.label,
            lazy: true,
            data: folder,
            _id: folder._id,
            handler: this.lazyTreeHandler
          })), 'label', 'asc'))
        } catch (error) {
          done([])
        }
      }, 1000)
    },
    async lazyTreeHandler (target) {
      this.$router.push('/myDrive/' + target.data._id)

      if (target.children) {
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
        let result = await this.$dbCon.services['juan-folders'].find({
          query: {
            $limit: 500,
            parentFolder: target.data._id,
            ...condition,
            $or
          }
        })
        console.log('lovely', result.data)
        target.children = result.data.map(folder => ({
          label: folder.label,
          lazy: true,
          data: folder,
          _id: folder._id,
          handler: this.lazyTreeHandler
        }))
      }
      await this.$forceUpdate()
    }
  }
}
</script>

<style>
.menu-list .q-item, .q-tree__node-header, .q-tree__node {
  border-radius: 0 32px 32px 0;
}
.q-tree > .q-tree__node--parent > .q-tree__node-header {
  height: 48px;
  padding-left: 10px;
}
.q-tree > .q-tree__node--parent > .q-tree__node-collapsible {
  padding-left: 6px;
}
.q-tree__node-header-content > div {
  position: relative;
  left: 12px;
}
.q-tree__node--selected, .q-tree__node--selected > div > div {
  color: #027be3
}
</style>
