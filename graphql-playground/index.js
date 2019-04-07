const express = require('express')
const http = require('http')
const https = require('https')
const fs = require('fs')
const gqlServer = require('./graphql/server')

const configurations = {
  production: { ssl: true, port: 443, hostname: 'localhost' },
  development: { ssl: false, port: 4000, hostname: 'localhost' }
}

const environment = process.env.NODE_ENV || 'development'
const config = configurations[environment]

const app = express()
gqlServer.applyMiddleware({ app })

let server
if (config.ssl) {
  // Assumes certificates are in .ssl folder from package root. Make sure the files
  // are secured.
  server = https.createServer(
    {
      key: fs.readFileSync(`./ssl/${environment}/server.key`),
      cert: fs.readFileSync(`./ssl/${environment}/server.cert`)
    },
    app
  )
} else {
  server = http.createServer(app)
}

// Add subscription support
gqlServer.installSubscriptionHandlers(server)

server.listen({ port: config.port }, () =>
  console.log(
    '🚀 Server ready at',
    `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${
      gqlServer.graphqlPath
    }`
  )
)
