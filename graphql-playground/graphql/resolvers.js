const { Books, Authors } = require('./data')
const { find, filter } = require('lodash')
const { UserInputError, withFilter } = require('apollo-server-express')

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
      const { pubsub } = context
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
      pubsub.publish('BOOK_ADDED', { bookAdded: newBook })
      return {
        code: '200',
        success: true,
        message: '',
        book: newBook
      }
    },
    likeBook: async (parent, args, context, info) => {
      const { id } = args
      const { pubsub } = context
      const bookObj = find(Books, { id })
      const response = {}

      if (!bookObj)
        throw new UserInputError('Invalid bookId', {
          invalidArgs: {
            authorId: 'not found'
          }
        })
      response.book = bookObj
      bookObj.like++
      if (bookObj.authorId) {
        const authorObj = find(Authors, { id: bookObj.authorId })
        if (authorObj) {
          authorObj.reputation++
        }
        pubsub.publish('REPUTATION_INC', { reputationChanged: authorObj })
        response.author = authorObj
      }

      return {
        code: '200',
        success: true,
        message: '',
        ...response
      }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: (parent, args, context, info) => {
        const { pubsub } = context
        return pubsub.asyncIterator(['BOOK_ADDED'])
      }
    },
    reputationChanged: {
      subscribe: withFilter(
        (parent, args, context, info) => {
          const { pubsub } = context
          return pubsub.asyncIterator(['REPUTATION_INC'])
        },
        (parent, args, context, info) => {
          const { id } = args
          return id ? parent.reputationChanged.id === id : true
        }
      )
    }
  }
}

module.exports = resolvers
