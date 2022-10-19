<template>
  <div>
    <pre v-for="(c, i) in logs" :key="i">{{c}}</pre>
    <input type="text" v-model="input" @keyup.enter="$dbCon.io.emit('cli', input), input=''">
    <button @click="$dbCon.io.emit('cli', 'cli-kill')">kill</button>
    <button @click="logs= []">clear</button>
  </div>
</template>
<script>
export default {
  data: () => ({
    input: '',
    logs: []
  }),
  mounted () {
    var enc = new TextDecoder('utf-8')
    this.$dbCon.io.on('cli', (c) => {
      c = (typeof c === 'string') ? c : enc.decode(c)
      this.logs.push(c)
    })
  }
}
</script>
