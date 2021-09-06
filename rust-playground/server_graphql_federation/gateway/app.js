const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} = require("apollo-server-core");

const gateway = new ApolloGateway({
  serviceList: [
    { name: "plannets", url: "http://localhost:8001" },
    { name: "satellites", url: "http://localhost:8002" },
  ],
  debug: true,
});

const server = new ApolloServer({
  gateway,
  introspection: true,
  playground: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen({ host: "0.0.0.0", port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
