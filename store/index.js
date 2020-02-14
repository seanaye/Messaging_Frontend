import jwtDecode from 'jwt-decode'
import login from '~/apollo/query/login'
import token from '~/apollo/query/token'
import addMessage from '~/apollo/mutation/addMessage'

export const state = () => ({
  access: '',
  accessExpiry: '',
  refresh: '',
  refreshExpiry: '',
  user: '',
  messages: [],
  error: '',
  now: new Date(),
  newMessage: ''
})

export const mutations = {
  M_LOGIN (state, access) {
    state.access = access
    const token = jwtDecode(access)
    state.accessExpiry = new Date(token.exp * 1000)
    state.user = token.user
  },
  M_LOGOUT (state) {
    state.access = ''
    state.user = ''
    state.accessExpiry = ''
  },
  M_ERROR (state, error) {
    state.error = error
  },
  UPDATE_TIME (state) {
    state.now = new Date()
  },
  LOAD_REFRESH (state, refresh) {
    if (refresh) {
      state.refresh = refresh
      const token = jwtDecode(refresh)
      state.refreshExpiry = new Date(token.exp * 1000)
    }
  },
  PUSH_MESSAGE (state, msgLst) {
    state.messages = [...state.messages, ...msgLst]
  },
  M_NEW_MESSAGE (state, value) {
    state.newMessage = value
  }
}

export const actions = {
  async login ({ dispatch }, credentials) {
    console.log(this.app)
    const res = await this.app.apolloProvider.defaultClient.query({
      query: login,
      variables: credentials
    })
    console.log(res)
    await dispatch('handleToken', res.data?.login)
  },
  async getAccess ({ dispatch, state }) {
    const res = await this.app.apolloProvider.defaultClient.query({
      query: token,
      context: {
        headers: {
          refresh: `Bearer ${state.refresh}`
        }
      }
    })
    await dispatch('handleToken', res.data?.token)
  },
  async handleToken ({ commit, dispatch }, { ok, error, access, refresh }) {
    if (ok) {
      dispatch('startTimer')
      localStorage.setItem('ea9dfed74921e99adbbb', refresh)
      commit('M_LOGIN', access)
      await this.app.$apolloHelpers.onLogin(access)
    } else {
      commit('M_ERROR', error || 'An unknown error has occured')
    }
  },
  startTimer ({ commit }) {
    setInterval(() => {
      commit('UPDATE_TIME')
    }, 1000 * 60)
  },
  async sendMsg ({ commit, state }) {
    console.log(this.app.apolloProvider)
    const res = await this.app.apolloProvider.defaultClient.mutate({
      mutation: addMessage,
      variables: {
        chat: 'chat',
        msg: state.newMessage
      }
    })
    if (res.data?.addMessage?.ok) {
      commit('M_NEW_MESSAGE', '')
    } else {
      commit('M_ERROR', res.data?.addMessage?.error || 'An unknown error has occured')
    }
  }
}

export const getters = {
  accessValid (state) {
    return state.access && state.now < state.accessExpiry
  },
  refreshValid (state) {
    return state.refresh && state.now < state.refreshExpiry
  }
}
