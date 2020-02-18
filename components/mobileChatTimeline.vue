<template>
  <v-timeline
    dense
    reverse
  >
    <v-timeline-item
      v-for="msg in messages"
      :key="msg._id"
      :left="msg.thisUser"
      :right="!msg.thisUser"
      :color="(msg.thisUser) ? 'primary': 'success'"
    >
      <template v-slot:icon>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <div
              v-on="on"
              @click="$emit('on')"
              style="height: 100%; width: 100%; z-index: 100;"
            ></div>
          </template>
          <span>
            {{msg.user}} {{msg.date}} {{msg.time}} {{msg.timeZone}}
          </span>
        </v-tooltip>
      </template>
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
                <template v-slot:append>
                  <v-btn
                    :disabled="newMessage.length === 0"
                    :loading="loading"
                    @click="$emit('sendMsg')"
                    @keydown.enter="$emit('sendMsg')"
                    color="primary"
                  >
                    Send
                  </v-btn>
                </template>
              </v-textarea>
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
