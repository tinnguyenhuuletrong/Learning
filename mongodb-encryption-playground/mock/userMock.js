const jsf = require('json-schema-faker')

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      faker: 'name.findName'
    },
    email: {
      type: 'string',
      faker: 'internet.email'
    }
  },
  required: ['name', 'email']
}

module.exports = {
  fakeOne: () => jsf.generate(schema),
  fakeMany: count =>
    Array(count)
      .fill(0)
      .map(itm => jsf.generate(schema))
}
