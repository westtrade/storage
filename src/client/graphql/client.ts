import makeClient from 'graphql-fetch'

const client = makeClient(`${location.protocol}//${location.host}/graphql`)
export default client
