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
                    v-model="password1"
                    :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="showPass ? 'text' : 'password'"
                    label="Password"
                    @click:append="showPass = !showPass"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="password2"
                    :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min, rules.match]"
                    :type="showPass ? 'text' : 'password'"
                    label="Confirm Password"
                    @click:append="showPass = !showPass"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-btn @click="createAccount" :loading="loading" :disabled="!valid">Create Account</v-btn>
                  <v-fade-transition>
                    <div v-if="error" style="color: red">{{error}}</div>
                  </v-fade-transition>
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
import jwtDecode from 'jwt-decode'
import createUser from '~/apollo/mutation/createUser'
import login from '~/apollo/query/login'

export default {
  layout: 'blank',
  data () {
    return {
      showPass: false,
      username: '',
      password1: '',
      password2: '',
      rules: {
        required: val => !!val || 'Required',
        min: val => val.length >= 8 || 'Minimum 8 Characters',
        match: val => (val === this.password1 && val === this.password2) || 'Passwords Must Match'
      },
      loading: false,
      error: '',
      valid: false
    }
  },
  computed: {
    loggedInUser () {
      return this.$store.state.user
    }
  },
  watch: {
    loggedInUser () {
      if (this.loggedInUser) {
        this.$router.push('/chat')
      }
    }
  },
  methods: {
    async createAccount () {
      const isValid = this.$refs.form.validate()
      if (isValid) {
        this.loading = true
        const res = await this.$apollo.mutate({
          mutation: createUser,
          variables: {
            username: this.username,
            password: this.password2
          }
        })
        console.log(res)
        if (res.data?.createUser?.ok) {
          this.login()
        } else {
          this.error = res.data?.createUser?.error || 'An error has occured'
          this.loading = false
        }
      }
    },
    async login () {
      const res = await this.$apollo.query({
        query: login,
        variables: {
          username: this.username,
          password: this.password2
        }
      })
      console.log(res)
      this.loading = false
      if (res.data?.login?.ok) {
        const token = jwtDecode(res.data.login.refresh)
        const expiry = new Date(token.exp * 1000)
        document.cookie = `ea9dfed74921e99adbbb:${res.data.login.refresh};${expiry.toUTCString()}`
        this.$store.commit('M_LOGIN', {
          access: res.data.login.access,
          username: token.user
        })
        await this.$apolloHelpers.onLogin(res.data.login.access)
      } else {
        this.error = res.data?.login?.error || 'An error has occured'
      }
    }
  }
}
</script>
