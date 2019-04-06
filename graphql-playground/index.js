const express = require('express')
const gqlServer = require('./graphql/server')

const app = express()
gqlServer.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  console.log(
    `🚀 Server ready at http://localhost:4000${gqlServer.graphqlPath}`
  )
)
