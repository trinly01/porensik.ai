<template>
  <q-dialog ref="dialog" :value="opened" @hide="$emit('input', false)">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Log Info</div>
      </q-card-section>

      <q-card-section>
        <codemirror ref="codem" @click.native="$refs.codem.refresh()" :code="$beautify(json, { indent_size: 2, space_in_empty_paren: true })" :options="{
          mode: {
            name: 'javascript',
            json: true
          },
          theme: 'default',
          line: true,
          lineNumbers: true,
          styleActiveLine: true,
          readOnly: 'nocursor'
        }"
        @focus="$refs.codem.refresh()"></codemirror>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Ok" @click="$emit('input', false)" />
        <!-- <q-btn color="primary" label="Create" @click="saveFolder" /> -->
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/lib/codemirror.css'
// import 'codemirror/theme/base16-light.css'
import { codemirror } from 'vue-codemirror'

export default {
  components: {
    codemirror
  },
  props: ['value', 'json'],
  computed: {
    opened () {
      this.refresh()
      return this.value
    }
  },
  methods: {
    refresh () {
      setTimeout(() => {
        if (this.$refs.codem) this.$refs.codem.refresh()
      }, 500)
    }
  }
}
</script>
