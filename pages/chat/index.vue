<template>
  <v-container fluid style="height: 100%">
    <v-row justify="center" align="start" style="height: 100%">
      <v-col v-if="thisUser" cols="12" md="10" lg="8" style="height: 100%; overflow-y: scroll">
        <v-timeline>
          <v-timeline-item
            v-for="msg in messages"
            :key="msg._id"
            :left="msg.thisUser"
            :right="!msg.thisUser"
            :color="(msg.thisUser) ? 'primary': 'secondary'"
          >
            <span slot="opposite">{{msg.user}} {{msg.timeStr}}</span>
            <v-card class="elevation-2">
              <v-card-text>{{msg.message}}</v-card-text>
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
export default {
  created () {
    this.componentSetup()
  },
  computed: {
    thisUser () {
      return this.$store.state.user
    },
    messages () {
      return this.$store.state.messages.map((elem) => {
        elem.thisUser = elem.user === this.thisUser
        const d = new Date(elem.time * 1000)
        elem.timeStr = `${d.getHours}:${d.getMinutes} ${d.getTime}`
      })
    }
  },
  methods: {
    async componentSetup () {
      if (this.isTokenValid()) {
        this.loadMessages()
      }
    },
    isTokenValid () {
      const now = new Date()
      const expiry = this.$store.state.accessExpiry
      return expiry && now < expiry
    }
  }
}
</script>
