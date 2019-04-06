const { ApolloServer, gql } = require('apollo-server-express')

const schema = require('fs').readFileSync(__dirname + '/schema.gql')
const typeDefs = gql`
  ${schema}
`
const resolvers = require('./resolvers')
const server = new ApolloServer({ typeDefs, resolvers })

module.exports = server
