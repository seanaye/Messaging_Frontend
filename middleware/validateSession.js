export default async function ({ store, redirect, route }) {
  console.log(route)
  let matchedRoute
  if (!store.getters.accessValid) {
    console.log('access not valid loading refresh')
    store.commit('LOAD_REFRESH', localStorage.getItem('ea9dfed74921e99adbbb'))
    if (store.getters.refreshValid) {
      console.log('refresh is valid getting access token')
      await store.dispatch('getAccess')
      if (!store.getters.accessValid) {
        console.log('access not valid')
        matchedRoute = '/'
      } else {
        console.log('new access token valid')
        matchedRoute = '/chat'
      }
    } else {
      console.log('refresh not valid, removing')
      localStorage.removeItem('ea9dfed74921e99adbbb')
      matchedRoute = '/'
    }
  } else {
    matchedRoute = '/chat'
  }

  console.log(matchedRoute)
  if (route.path !== matchedRoute) {
    return redirect(matchedRoute)
  }
}
