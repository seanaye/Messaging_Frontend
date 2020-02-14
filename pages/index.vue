<template>
  <v-container>
    <v-row align="center" justify="center" style="height: 100vh;">
      <v-card class="pa-4">
        <v-card-title>
          <h3>Create Account</h3>
        </v-card-title>
        <v-card-actions>
          <v-form v-model="valid" ref="form">
            <v-container>
              <v-row align="center" justify="center">
                <v-col cols="12">
                  <v-text-field
                    v-model="username"
                    label="Username"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="showPass ? 'text' : 'password'"
                    label="Password"
                    @click:append="showPass = !showPass"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-btn @click="login" :loading="loading" :disabled="!valid" color="primary">Login</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      showPass: false,
      password: '',
      username: '',
      valid: false,
      loading: false,
      rules: {
        required: val => !!val || 'Required',
        min: val => val.length >= 8 || 'Minimum 8 Characters'
      }
    }
  },
  methods: {
    async login () {
      this.loading = true
      await this.$store.dispatch('login', { username: this.username, password: this.password })
      this.loading = false
      if (this.$store.getters.accessValid) {
        console.log('redirect')
        this.$router.push({ path: '/chat' })
      }
    }
  }
}
</script>
