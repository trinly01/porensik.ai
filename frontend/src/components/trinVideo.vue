<template>
  <video v-if="objUrl" controls class="thumbnail" preload="none">
    <source :src="objUrl">
    Your browser does not support the <code>video</code> tag.
  </video>
  <div v-else></div>
</template>

<script>
export default {
  props: ['src', 'headers'],
  async mounted () {
    try {
      let res = await this.$axios.get(this.src,
        {
          responseType: 'blob',
          headers: {
            Authorization: this.jwt
          }
        }
      )
      this.objUrl = URL.createObjectURL(res.data)
    } catch (error) {
      console.log(error, this.jwt)
      this.objUrl = this.src
    }
  },
  data () {
    return {
      objUrl: '',
      jwt: window.localStorage.getItem(`${this.$dbCon.io.io.uri}-jwt`)
    }
  }
}
</script>
