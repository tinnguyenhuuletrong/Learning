const { normalize, schema } = require('normalizr')
const rawData = require('./raw/articles.json')

// Process each entity
const userProcessStrategy = (value, parent, key) => {
  if (key === 'commenter') {
    return {
      ...value,
      comments: [parent.id]
    }
  } else if (key === 'author') {
    return {
      ...value,
      articles: [parent.id]
    }
  }
  return value
}

// Merge 2 entity
const userMergeStrategy = (entityA, entityB) => {
  return {
    ...entityA,
    ...entityB,
    comments: [...(entityA.comments || []), ...(entityB.comments || [])],
    articles: [...(entityA.articles || []), ...(entityB.articles || [])]
  }
}

const User = new schema.Entity(
  'users',
  {},
  {
    idAttribute: '_id',
    processStrategy: userProcessStrategy,
    mergeStrategy: userMergeStrategy
  }
)
const Comment = new schema.Entity('comments', {
  commenter: User
})
const Article = new schema.Entity('articles', {
  comments: [Comment],
  author: User
})

const normalizedData = normalize(rawData, [Article])
console.log(normalizedData)
