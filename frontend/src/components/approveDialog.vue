<template>
<q-menu ref="qMenu" @show="() => $refs.password.select()" anchor="top right" self="bottom middle">
  <q-card style="width: 300px;">
    <q-card-section class="row">
      <div v-if="signHandler" class="text-h6 col">DigiSign</div>
      <div v-else class="text-h6 col">Approve Document</div>
      <div>
        <!-- <q-btn label="Draft a Revision" /> -->
      </div>
    </q-card-section>
    <q-card-section class="col">
      <div v-if="node" class="row">
        <!-- node.security.approvers -->
        <q-chip dense v-for="u in node.security.approvers.map(u => ({approved: false, ...u}))" :key="u._id">
          <q-avatar :icon="u.approved ? 'thumb_up': 'watch_later'" :color="u.approved ? 'secondary': 'grey'" text-color="white" />
          {{u.label}}
        </q-chip>
      </div>
      <q-input
      @keyup.enter="(signHandler ? sign() : approve())"
      ref="password"
      dense
      rounded
      outlined
      v-model="password"
      :error="isWrongPass"
      :type="isPwd ? 'password': 'text'">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <div v-show="isWrongPass" class="q-field__bottom text-negative" style="position: relative; bottom: 20px;">Wrong-Password</div>
    </q-card-section>
    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Cancel" v-close-popup />
      <q-btn :loading="loading" v-if="signHandler" color="primary" label="Sign" :disabled="!password" @click="sign" />
      <q-btn :loading="loading" v-else color="primary" label="Approve" :disabled="!password" @click="approve" />
    </q-card-actions>
  </q-card>
</q-menu>
</template>

<script>
export default {
  props: ['node', 'signHandler'],
  data: () => ({
    password: '',
    isPwd: true,
    isWrongPass: false,
    loading: false
  }),
  methods: {
    async sign () {
      console.log('signing...')
      this.loading = true
      try {
        await this.$axios.post(this.$dbCon.io.io.uri + '/authentication', {
          strategy: 'sso',
          email: this.$root.user.email,
          password: this.password
        })
        this.loading = false
        this.signHandler(true)
        this.$refs.qMenu.hide()
      } catch (error) {
        console.error(error)
        this.loading = false
        this.isWrongPass = true
        this.$refs.password.select()
        this.$forceUpdate()
        setTimeout(() => {
          this.isWrongPass = false
        }, 5000)
        this.signHandler(false)
      }
    },
    async approve () {
      this.loading = true
      try {
        let asdasda = await this.$axios.post(this.$dbCon.io.io.uri + '/authentication', {
          strategy: 'sso',
          email: this.$root.user.email,
          password: this.password
        })
        console.log('asdasda', asdasda)
        let index = this.$lodash.findIndex(this.node.security.approvers, user => user.value._id === this.$root.user._id)
        let patch = {}
        patch[`security.approvers.${index}.approved`] = true
        this.loading = false
        this.$dbCon.services['juan-files'].patch(this.node._id, patch)
      } catch (error) {
        console.error(error)
        this.loading = false
        this.isWrongPass = true
        setTimeout(() => {
          this.isWrongPass = false
        }, 5000)
      }
    }
  }
}
</script>
