<template>
  <q-input :bg-color="bgColor" :input-class="inputClass" dark dense standout  placeholder="Search" style="min-width: 489px; max-width: 720px; max-height: 46px;"
    ref="search"
    v-model="searchText"
    @focus="onFocus"
    @blur="onBlur"
    debounce="1000"
  >
    <template v-slot:prepend>
      <q-icon name="search" color="grey"/>
      <!-- <q-icon v-else name="clear" class="cursor-pointer" @click="text = ''" /> -->
    </template>
    <template v-slot:append>
      <q-icon name="arrow_drop_down" color="grey"/>
      <!-- <q-icon v-else name="clear" class="cursor-pointer" @click="text = ''" /> -->
    </template>
    <q-menu fit v-model="hasResults">
      <q-list style="min-width: 100px" class="q-mb-md">
        <q-item v-if="suggestions.length" clickable v-ripple @click="searchText = suggestions.join(' '), $refs.search.focus()">
          <q-item-section>
            <q-item-label caption>
              Suggestion: <i>{{ suggestions.join(' ') }}</i>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item-label header>Files</q-item-label>
        <!-- <q-separator /> -->
        <q-item @click="open(f)" clickable v-ripple v-for="f in files" :key="'search'+f._id">
          <q-item-section avatar top>
            <q-avatar icon="assignment" color="grey" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">
              <text-highlight :queries="suggestionsMatched">
                {{ f.label }}
              </text-highlight>
            </q-item-label>
            <q-item-label caption>{{ f.logs[0].user.personal_information.first_name }} {{ f.logs[0].user.personal_information.surname }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            {{ $moment(f.logs[f.logs.length-1].timestamp).format('lll') }}
          </q-item-section>
        </q-item>
        <!-- asd -->
        <q-item-label header>Folders</q-item-label>
        <q-item @click="open(f)" clickable v-ripple v-for="f in folders" :key="'search'+f._id">
          <q-item-section avatar top>
            <q-avatar icon="folder" color="grey" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">
              <text-highlight :queries="searchText.split(' ')">
                {{ f.label }}
              </text-highlight>
            </q-item-label>
            <q-item-label caption>{{ f.logs[0].user.personal_information.first_name }} {{ f.logs[0].user.personal_information.surname }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            {{ $moment(f.logs[f.logs.length-1].timestamp).format('lll') }}
          </q-item-section>
        </q-item>
        <!-- <q-separator /> -->
      </q-list>
    </q-menu>
  </q-input>
</template>

<script>
import textHighlight from 'vue-text-highlight'
// var Typo = require('typo-js')
// var dictionary = new Typo('en_US')

export default {
  components: { textHighlight },
  watch: {
    async searchText (searchText) {
      console.log('bouncing...')
      if (searchText.length > 1) {
        this.search(searchText)
      } else {
        this.files = []
        this.folders = []
        this.suggestions = []
      }
      let keywords = searchText.split(' ')
      try {
        // let suggestions = require('puzzy-search').suggest(searchText).split(' ')
        let suggestions = (await this.$axios.get(this.$dbCon.io.io.uri + '/suggestspell?str=' + searchText)).data
        this.suggestions = suggestions
        Array.prototype.push.apply(keywords, suggestions)
        console.log('suggestions', suggestions)
        this.suggestionsMatched = keywords
      } catch (error) {
        this.suggestionsMatched = keywords
        this.suggestions = []
      }
    }
  },
  mounted () {
    this.foldersSrvc = this.$dbCon.wingsService('juan-folders')
    this.filesSrvc = this.$dbCon.wingsService('juan-files')
  },
  beforeDestroy () {
    this.foldersSrvc.destroy()
    this.filesSrvc.destroy()
  },
  data: () => ({
    foldersSrvc: null,
    filesSrvc: null,
    bgColor: 'blue-grey-1',
    inputClass: 'text-grey',
    hasResults: false,
    files: [],
    folders: [],
    searchText: '',
    suggestions: [],
    suggestionsMatched: []
  }),
  methods: {
    async getSuggestions () {
    },
    onFocus () {
      setTimeout(() => {
        this.$refs.search.focus()
      }, 100)
      this.bgColor = 'white'
      this.inputClass = 'text-black'
    },
    onBlur () {
      this.bgColor = 'blue-grey-1'
      this.inputClass = 'text-grey'
    },
    async search (newVal) {
      // let keywords = newVal.split(' ')
      // let escapedKeywords = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      // let regexp = escapedKeywords.join('|')
      // console.log(escapedKeywords)
      const condition = {
        $limit: 10,
        $search: newVal,
        $sort: {
          'counter': -1,
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
      // console.log('searching...', {
      //   query: {
      //     ...condition,
      //     $or,
      //     $select: ['label', 'logs.0.user.personal_information', 'logs', '_id']
      //   }
      // })
      let resultFiles = await this.filesSrvc.find({
        query: {
          ...condition,
          $or,
          $select: ['label', 'counter', 'parentFolder', 'logs.0.user.personal_information', 'logs', '_id']
        }
      })
      console.log('searching...FILES')
      this.files = resultFiles.data
      // Array.prototype.push.apply(this.result, resultFiles.data)
      let resultFolders = await this.foldersSrvc.find({
        query: {
          ...condition,
          $or,
          $select: ['label', 'counter', 'parentFolder', 'logs.0.user.personal_information', 'logs', '_id']
        }
      })
      console.log('searching...FOLDERS')
      this.folders = resultFolders.data
      this.hasResults = true
      setTimeout(() => {
        this.$refs.search.focus()
      }, 100)
    },
    async open (node) {
      if (node.isFolder) {
        this.$router.push('/myDrive/' + node._id)
        await this.foldersSrvc.patch(node._id, {
          $inc: {
            counter: 1
          }
        })
      } else {
        await this.filesSrvc.patch(node._id, {
          $inc: {
            counter: 1
          }
        })
        this.$router.push('/myDrive/' + node.parentFolder + '?f=' + node._id)
      }
      this.hasResults = false
    }
  }
}
</script>
