const { ApolloServer, gql, PubSub } = require('apollo-server-express')

const pubsub = new PubSub()

const schema = require('fs').readFileSync(__dirname + '/schema.gql')
const typeDefs = gql`
  ${schema}
`
const resolvers = require('./resolvers')
const server = new ApolloServer({
  typeDefs,
  resolvers,
  rootValue: { _type: 'rootQueryObj' },
  context: ({ req, connection }) => {
    let connectionType = 'http'
    if (connection) {
      connectionType = 'ws'
    }
    return {
      connectionType,
      pubsub,
      authScope: []
    }
  },
  subscriptions: {
    onConnect: (connectionParams, webSocket, context) => {
      console.log('on ws connect', connectionParams)
      return true
    },
    onDisconnect: (webSocket, context) => {
      console.log('on ws disconnect', connectionParams)
      return true
    }
  }
})

module.exports = server
