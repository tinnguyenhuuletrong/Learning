const { Books, Authors } = require('./data')
const { find, filter } = require('lodash')

const resolvers = {
  Query: {
    books: async () => Books,
    bookById: async (parent, args, context, info) =>
      find(Books, { id: args.id }),
    authors: async () => Authors
  },
  Book: {
    author: async book => find(Authors, { id: book.authorId })
  },
  Author: {
    books: async author => filter(Books, { authorId: author.id })
  }
}

module.exports = resolvers
