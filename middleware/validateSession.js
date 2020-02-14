export default async function ({ store, redirect, route }) {
  console.log(route)
  let authenticated
  if (!store.getters.accessValid) {
    console.log('access not valid loading refresh')
    store.commit('LOAD_REFRESH', localStorage.getItem('ea9dfed74921e99adbbb'))
    if (store.getters.refreshValid) {
      console.log('refresh is valid getting access token')
      await store.dispatch('getAccess')
      if (!store.getters.accessValid) {
        console.log('access not valid')
        authenticated = false
      } else {
        console.log('new access token valid')
        authenticated = true
      }
    } else {
      console.log('refresh not valid, removing')
      localStorage.removeItem('ea9dfed74921e99adbbb')
      authenticated = false
    }
  } else {
    authenticated = true
  }

  console.log(authenticated)
  if (!authenticated && route.path === '/chat') {
    return redirect('/')
  } else if (authenticated && route.path !== '/chat') {
    return redirect('/chat')
  }
}
