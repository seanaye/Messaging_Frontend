<template>
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
                id="msgBox"
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
                @click="$emit('sendMsg')"
                @keydown.enter="$emit('sendMsg')"
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
</template>

<script>
export default {
  props: {
    messages: Array,
    loading: Boolean
  },
  computed: {
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
    this.$vuetify.goTo('#msgBox', { duration: 800 })
  }
}
</script>
