<template>
  <v-app>
    <v-snackbar
      v-model="$store.state.error"
      top
      multi-line
    >
      {{$store.state.error}}
      <v-btn
        color="red"
        text
        @click="$store.commit('M_ERROR', '')"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-content>
      <nuxt></nuxt>
    </v-content>
    <v-footer absolute app padless>
      <v-card flat tile class="text-center" color="primary" width="100%">
        <v-card-text>
          <span style="color: white">Made with ❤️ - Sean Aye 2020</span>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>
