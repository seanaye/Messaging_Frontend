<template>
  <v-container fluid style="height: 100%">
    <v-row justify="center" align="start" style="height: 100%">
      <v-col v-if="thisUser" cols="12" md="10" lg="8">
        <v-timeline>
          <v-timeline-item
            v-for="(msg, i) in messages"
            :key="msg._id"
            :left="msg.thisUser"
            :right="!msg.thisUser"
            :color="(msg.thisUser) ? 'primary': 'success'"
          >
            <span slot="opposite">
              {{(i > 0 && messages[i-1].user === msg.user) ? '' : msg.user}} {{msg.time}} {{(i > 0 && messages[i-1].user === msg.user) ?  '' : msg.timeZone}}
            </span>
            <v-card class="elevation-2">
              <v-card-text>{{msg.message}}</v-card-text>
            </v-card>
          </v-timeline-item>
          <v-timeline-item
            left
            color="primary"
          >
            <v-card class="elevation-2">
              <v-card-actions>
                <v-row justify="end" no-gutters>
                  <v-col cols="12">
                    <v-textarea
                      ref="msgBox"
                      v-model="newMessage"
                      label="Say Something"
                      outlined
                      autofocus
                      auto-grow
                      no-resize
                      shaped
                      dense
                    >
                    </v-textarea>
                  </v-col>
                  <v-col>
                    <v-spacer></v-spacer>
                    <v-btn
                      :disabled="newMessage.length === 0"
                      :loading="loading"
                      @click="sendMsg"
                      @keydown.enter="sendMsg"
                      color="primary"
                    >
                      Send
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-col>
      <v-progress-circular
        indeterminate
        v-else
      ></v-progress-circular>
    </v-row>
  </v-container>
</template>

<script>
import getMessages from '~/apollo/query/getMessages'
import subMessage from '~/apollo/subscription/subMessage'

export default {
  data () {
    return {
      loading: false
    }
  },
  computed: {
    accessValid () {
      return this.$store.getters.accessValid
    },
    thisUser () {
      return this.$store.state.user
    },
    messages () {
      return this.$store.state.messages.map((elem) => {
        const newObj = {}
        newObj._id = elem._id
        newObj.user = elem.user
        const d = new Date(elem.time * 1000)
        newObj.timeZone = `${d.toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2]}`
        newObj.time = `${d.getHours()}:${(d.getMinutes() < 10) ? '0' : ''}${d.getMinutes()}`
        newObj.thisUser = elem.user === this.thisUser
        newObj.message = elem.message
        return newObj
      })
    },
    newMessage: {
      get () {
        return this.$store.state.newMessage
      },
      set (value) {
        this.$store.commit('M_NEW_MESSAGE', value)
      }
    }
  },
  mounted () {
    this.queryMessages()
    this.subscribe()
    this.$vuetify.goTo(this.$refs.msgBox, { duration: 400 })
  },
  methods: {
    async queryMessages () {
      const res = await this.$apollo.query({
        query: getMessages,
        variables: {
          chat: 'chat',
          last: 100
        }
      })
      if (res.data?.getMessages?.ok) {
        this.$store.commit('PUSH_MESSAGE', res.data.getMessages.messages)
      } else {
        await this.$store.dispatch('getAccess')
      }
    },
    subscribe () {
      const observer = this.$apollo.subscribe({
        query: subMessage,
        variables: {
          chat: 'chat',
          access: this.$store.state.access
        }
      })
      const that = this
      observer.subscribe({
        next (res) {
          console.log(res)
          console.log(this)
          if (res.data?.subMessage?.ok) {
            that.$store.commit('PUSH_MESSAGE', [res.data.subMessage.message])
          }
        },
        error (error) {
          console.log(error)
        }
      })
    },
    async sendMsg () {
      this.loading = true
      await this.$store.dispatch('sendMsg')
      this.loading = false
    }
  },
  watch: {
    async accessValid () {
      if (!this.accessValid) {
        await this.$store.dispatch('getAccess')
        this.subscribe()
        if (!this.accessValid) {
          this.$store.commit('M_ERROR', 'Unable to login')
          this.$router.push('/')
        }
      }
    }
  }
}
</script>
