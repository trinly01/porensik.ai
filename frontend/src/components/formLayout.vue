<style>
.CodeMirror {
  height: 100%;
}
.CodeMirror-scroll {
  max-height: 100%;
}
</style>
<template>
  <q-dialog ref="qDialog">
    <q-layout class="bg-white text-black" container style="min-width: 80vw;">
      <q-header class="bg-white text-black shadow-up-1">
        <q-toolbar class="">
          <q-btn flat round dense icon="fas fa-file-signature" color="purple" />
          <q-toolbar-title>Layout</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-header>
      <q-page-container class="col">
        <div class="row" style="height: calc(100% + 50px)">
          <div class="col full-height" style="max-width: 420px;">
            <codemirror ref="codem" @click.native="$refs.codem.refresh()" :options="{
              mode: 'htmlmixed',
              theme: 'solarized',
              lineNumbers: true,
              styleActiveLine: true
            }"
            v-model="form.layout"
            class="full-height"
            @focus="$refs.codem.refresh()"></codemirror>
          </div>
          <div id="display" class="col full-height" style="max-height: calc(100% + 50px); overflow: auto;">
            <!-- <div v-for="(asd, i) in (new Array(100))" :key="i">asd</div> -->
            <span v-html="form.layout"></span>
            <div class="col fixed-bottom-right" style="bottom: 58px; right: 6px;">
              <div v-for="(q, ii) in value.format" :key="ii+'d'"><q-chip size="sm" class="text-white bg-purple">q{{ii}} | {{q.field}}</q-chip></div>
            </div>
            <!-- <br/> {{ form.layout.charAt(form.layout.length-1) }} -->
            <!-- <br/> {{ value.layout.charAt(value.layout.length-1) }} -->
            <!-- {{value.layout}} -->
            <!-- <juan-input :node="value" :query="value.format[0]"></juan-input> -->
            <!-- <pre><code>{{ value.format }}</code></pre> -->
          </div>
        </div>
      </q-page-container>
      <q-footer>
        <q-toolbar class="bg-white text-black shadow-1">
          <!-- <q-btn color="purple" icon="view_quilt" label="Layout" v-close-popup /> -->
          <q-toolbar-title></q-toolbar-title>
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            v-if="value"
            color="purple"
            label="Save"
            :disabled="value.layout === form.layout"
            @click="save" />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script>
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/solarized.css'
// import 'codemirror/theme/base16-light.css'
import { codemirror } from 'vue-codemirror'
import juanInput from 'components/juanInput.vue'
export default {
  props: ['value'],
  components: { codemirror },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  mounted () {
    this.interval = setInterval(() => {
      // console.log('interval', this.value)
      this.value.format.map((query, qi) => {
        // console.log('q' + qi)
        let el = document.querySelector('q' + qi)
        // console.log(el)
        if (el) {
          // console.log('meron')
          let c = new this.$Vue({
            ...juanInput,
            propsData: {
              node: this.value,
              query,
              'v-model': query.value,
              qi,
              response: {},
              hasResponse: false,
              format: this.value.format,
              root: this.$root
            }
          })
          c.$root = this.$root
          c.$mount(el)
        }
      })
    }, 2000)
  },
  data () {
    return {
      form: { layout: '' },
      code: ''
    }
  },
  methods: {
    async save () {
      let log = {
        action: 'Modified',
        timestamp: Date.now(),
        data: {
          old: this.$deepDiff(this.value, this.form),
          new: this.$deepDiff(this.form, this.value)
        },
        user: this.$root.user
      }
      this.form = this.$lodash.cloneDeep(await this.$dbCon.services['juan-files'].patch(this.value._id, {
        layout: this.form.layout,
        $push: {
          'logs': log
        }
      }))
      this.value.layout = this.form.layout
      // this.$emit('input', this.form)
      this.$q.notify({
        message: 'Layout savedd',
        position: 'bottom',
        color: 'purple',
        actions: [{ icon: 'close', color: 'white', round: true }]
      })
    },
    show () {
      this.$refs.qDialog.show()
      this.form = this.$lodash.cloneDeep(this.value)
    }
  }
}
</script>
