var express = require('express');
var graphqlHTTP = require('express-graphql');

// 	Construct a schema, using GraphQL schema language
// 	https://github.com/facebook/graphql
const schema = require("./schema/starWarsSchema")

// The root provides a resolver function for each API endpoint
// var root = {
//   hello: () => {
//     return 'Hello world!';
//   },
// };

var app = express();
app.use('/graphql', graphqlHTTP({
	schema: schema,
	// rootValue: root,
	graphiql: true
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');