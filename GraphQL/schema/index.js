const {graphql, GraphQLSchema, GraphQLObjectType, GraphQLString} = require('graphql');

const rootNode = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'root',
        fields: {
            hello: {
                type: GraphQLString,
                resolve() {
                    return 'TTin Hello GraphQL';
                }
            }
        }
    })
});

module.exports = root
