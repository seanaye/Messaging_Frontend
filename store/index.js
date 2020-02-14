import jwtDecode from 'jwt-decode'

export const state = () => ({
  access: '',
  accessExpiry: '',
  user: '',
  messages: []
})

export const mutations = {
  M_LOGIN (state, { access, username }) {
    state.access = access
    state.user = username
    const token = jwtDecode(access)
    state.accessExpiry = new Date(token.exp * 1000)
  },
  M_LOGOUT (state) {
    state.access = ''
    state.user = ''
    state.accessExpiry = ''
  }
}
