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
                  <v-btn @click="createAccount" :loading="loading" :disabled="!valid" color="primary">Create Account</v-btn>
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
import createUser from '~/apollo/mutation/createUser'

export default {
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
          await this.$store.dispatch('login', { username: this.username, password: this.password2 })
          this.loading = false
        } else {
          this.error = res.data?.createUser?.error || 'An error has occured'
          this.loading = false
        }
      }
    }
  }
}
</script>
