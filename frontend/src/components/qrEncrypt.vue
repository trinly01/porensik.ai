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
          <q-toolbar-title>QRTransfer</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-header>
      <q-page-container class="col">
        <div class="row">
          <q-input type="password" label="secret key" />
          <q-btn label="generate QR" @click="generate" />
        </div>
        {{enc}}
        <vue-qr v-if="enc" :text="enc" :size="300" :margin="8"></vue-qr>
      </q-page-container>
      <q-footer>
        <q-toolbar class="bg-white text-black shadow-1">
          <!-- <q-btn color="purple" icon="view_quilt" label="Layout" v-close-popup /> -->
          <q-toolbar-title></q-toolbar-title>
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            v-if="value"
            color="purple"
            label="Save" />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script>
var LZString = require('lz-string/libs/lz-string.min.js')
// var CryptoJS = require('crypto-js')
import VueQr from 'vue-qr'
export default {
  props: ['value'],
  components: { VueQr },
  beforeDestroy () {},
  mounted () {},
  data () {
    return {
      enc: '',
      secret: ''
    }
  },
  methods: {
    show () {
      this.$refs.qDialog.show()
    },
    generate () {
      // const SECRET = this.secret

      // function enc (plainText) {
      //   var b64 = CryptoJS.AES.encrypt(plainText, SECRET).toString()
      //   var e64 = CryptoJS.enc.Base64.parse(b64)
      //   var eHex = e64.toString(CryptoJS.enc.Hex)
      //   return eHex
      // }

      // this.enc = enc(JSON.stringify(this.value))

      // function dec(cipherText){
      //   var reb64 = CryptoJS.enc.Hex.parse(cipherText);
      //   var bytes = reb64.toString(CryptoJS.enc.Base64);
      //   var decrypt = CryptoJS.AES.decrypt(bytes, SECRET);
      //   var plain = decrypt.toString(CryptoJS.enc.Utf8);
      //   return plain;
      // }
      this.enc = LZString.compress(JSON.stringify(this.value))
    }
  }
}
</script>
