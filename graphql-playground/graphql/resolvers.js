const { Books, Authors } = require('./data')
const { find, filter } = require('lodash')
const { UserInputError } = require('apollo-server-express')

const resolvers = {
  // Query
  Query: {
    books: async () => Books,
    bookById: async (parent, args, context, info) => {
      return find(Books, { id: args.id })
    },
    authors: async () => Authors,
    authorById: async (parent, args, context, info) => {
      return find(Authors, { id: args.id })
    }
  },

  // Model
  Book: {
    author: async book => {
      return find(Authors, { id: book.authorId })
    }
  },
  Author: {
    books: async author => {
      return filter(Books, { authorId: author.id })
    }
  },

  // Mutation
  Mutation: {
    addBook: async (parent, args, context, info) => {
      const {
        input: { title, authorId }
      } = args
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
        like: 0,
        authorId
      }
      Books.push(newBook)
      return {
        code: '200',
        success: true,
        message: '',
        book: newBook
      }
    }
  }
}

module.exports = resolvers
