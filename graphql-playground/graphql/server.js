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
    if (connection) {
      console.log(connection.context)
    }
    return {
      pubsub,
      authScope: []
    }
  }
})

module.exports = server
