const { Books, Authors } = require('./data')
const { find, filter } = require('lodash')
const { UserInputError } = require('apollo-server-express')

const resolvers = {
  // Query
  Query: {
    books: async () => Books,
    bookById: async (parent, args, context, info) =>
      find(Books, { id: args.id }),
    authors: async () => Authors
  },

  // Model
  Book: {
    author: async book => find(Authors, { id: book.authorId })
  },
  Author: {
    books: async author => filter(Books, { authorId: author.id })
  },

  // Mutation
  Mutation: {
    addBook: async (parent, args, context, info) => {
      const { title, authorId } = args
      const authorObj = find(Authors, { id: authorId })
      if (!authorObj)
        throw new UserInputError('Invalid authorId', {
          invalidArgs: {
            authorId: 'not found'
          }
        })
      const newBook = {
        id: Books.length + 1,
        title,
        authorId
      }
      Books.push(newBook)
      return newBook
    }
  }
}

module.exports = resolvers
