const Books = [
  {
    id: 1,
    title: 'Harry Potter and the Chamber of Secrets',
    like: 0,
    authorId: 1
  },
  {
    id: 2,
    title: 'Jurassic Park',
    like: 0,
    authorId: 2
  },
  {
    id: 3,
    title: `Harry Potter and the Philosopher's Stone`,
    like: 0,
    authorId: 1
  }
]
const Authors = [
  {
    id: 1,
    reputation: 0,
    name: 'J.K. Rowling'
  },
  {
    id: 2,
    reputation: 0,
    name: 'Michael Crichton'
  }
]
module.exports = { Books, Authors }
