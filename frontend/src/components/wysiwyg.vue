<template>
  <!-- <vue-editor
    ref="vueEditor"
    style="height: calc(100% - 150px)"
    useCustomImageHandler
    @imageAdded="handleImageAdded"
    v-model="content">
  </vue-editor> -->
  <div style="height: calc(100% - 50px)">
    <viewer
      v-if="view"
      :value="value"
      height="500px"
    />
    <editor
      v-else
      ref="tuiEditor"
      @input="(c) => $emit('input', content)"
      @stateChange ="(evs) => {
        content = $refs.tuiEditor.editor.getValue()
        $emit('input', content)
      }"
      v-model="content"
      :options="{
        useCommandShortcut: true,
        exts: [
          'chart',
          'uml',
          'table',
          'colorSyntax',
          'scrollSync'
        ]
      }"
      height="100%"
      previewStyle="vertical"
      mode="wysiwyg">
    </editor>
  </div>
</template>

<script>
import 'tui-editor/dist/tui-editor.css'
import 'tui-editor/dist/tui-editor-contents.css'
import 'codemirror/lib/codemirror.css'
import 'highlight.js/styles/github.css'
import Editor from '@toast-ui/vue-editor/src/Editor.vue'
import { Viewer } from '@toast-ui/vue-editor'

// if (process.env.CLIENT) {
require('tui-editor/dist/tui-editor-extChart')
require('tui-editor/dist/tui-editor-extUML.js')
require('tui-editor/dist/tui-editor-extTable.js')
require('tui-editor/dist/tui-editor-extColorSyntax.js')
require('tui-color-picker/dist/tui-color-picker.css')
require('tui-editor/dist/tui-editor-extScrollSync.js')
// }
// import hljs from 'highlight.js'
// import 'highlight.js/styles/monokai-sublime.css'
// import 'quill-better-table/dist/quill-better-table.css'
// import { VueEditor, Quill } from 'vue2-editor'
// window.Quill = Quill
// import { ImageDrop } from 'quill-image-drop-module'
// import ImageResize from 'quill-image-resize'
// import QuillBetterTable from 'quill-better-table'
// const quillTable = require('quill-table')

// Quill.register(quillTable.TableCell)
// Quill.register(quillTable.TableRow)
// Quill.register(quillTable.Table)
// Quill.register(quillTable.Contain)
// Quill.register('modules/table', quillTable.TableModule)

// Quill.register('modules/imageDrop', ImageDrop)
// Quill.register('modules/imageResize', ImageResize)
// Quill.register('modules/better-table', QuillBetterTable)

// Quill.register({
//   'modules/better-table': QuillBetterTable
// }, true)

export default {
  components: { Editor, Viewer },
  props: {
    value: String,
    view: Boolean
  },
  mounted () {
    this.content = this.value
    // let tableModule = Quill.getModule('better-table')
    // this.tableModule = this.$refs.vueEditor.quill.getModule('better-table')
  },
  data () {
    return {
      content: ''
      // highlight: text => hljs.highlightAuto(text).value
    }
  },
  computed: {
    htmlContent () {
      let content = this.content
      content.toString()
      let s = this.$refs.tuiEditor
      if (s) {
        console.log(this.$refs.tuiEditor.editor.getHtml())
        return this.$refs.tuiEditor.invoke('getHtml')
      } else {
        return ''
      }
    }
  },
  methods: {
    insertTable () {
      // console.log(this.$refs.vueEditor.quill.getModule('table'))
      this.$refs.vueEditor.quill.getModule('better-table').insertTable(3, 3)
    },
    handleImageAdded: function (file, Editor, cursorLocation, resetUploader) {
      console.log('Hoy!')
      var formData = new FormData()
      formData.append('file', file)

      this.$axios({
        url: `${this.$dbCon.io.io.uri}/uploads`,
        method: 'POST',
        headers: { 'Authorization': window.localStorage.getItem(`${this.$dbCon.io.io.uri}-jwt`) },
        data: formData
      })

      // console.log(result)
    }
  }
}
</script>
