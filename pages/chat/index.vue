<template>
  <v-container fluid style="height: 100%">
    <v-snackbar v-model="acknoledge" top>
      Tap on message nodes to view delivery time
      <v-btn
        color="error"
        text
        @click="hasAcknoledged"
      >
        Dont show again
      </v-btn>
    </v-snackbar>
    <v-row justify="center" align="start" style="height: 100%">
      <v-col v-if="thisUser" cols="12" md="10" lg="8">
        <component
          :is="($vuetify.breakpoint.smAndDown) ? 'mobileChatTimeline' : 'desktopChatTimeline'"
          :messages="messages"
          :loading="loading"
        ></component>
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
  components: {
    desktopChatTimeline: () => import('~/components/desktopChatTimeline'),
    mobileChatTimeline: () => import('~/components/mobileChatTimeline')
  },
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
        newObj.date = `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`
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
    },
    acknoledge: {
      get () {
        return !localStorage.getItem('acknoledged')
      },
      set (val) {
        return !val
      }
    }
  },
  mounted () {
    this.queryMessages()
    this.subscribe()
  },
  methods: {
    hasAcknoledged () {
      localStorage.setItem('acknoledged', 'acknoledged')
      this.acknoledge = 'acknoloedged'
    },
    async queryMessages () {
      const res = await this.$apollo.query({
        query: getMessages,
        variables: {
          chat: 'chat',
          last: 100
        }
      })
      if (res.data?.getMessages?.ok) {
        this.$store.commit('PUSH_MESSAGE', { msgLst: res.data.getMessages.messages, replace: true })
      } else {
        await this.$store.dispatch('getAccess')
      }
      await this.$nextTick()
      this.$vuetify.goTo('#msgBox', { duration: 800 })
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
            that.$store.commit('PUSH_MESSAGE', { msgLst: [res.data.subMessage.message], replace: false })
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
