export default function ({ store }) {
  return {
    getAuth: () => `Bearer ${store.state.access}`,
    httpEndpoint: 'https://mc.seanaye.ca/graphql/',
    wsEndpoint: 'wss://mc.seanaye.ca/graphql/'
  }
}
