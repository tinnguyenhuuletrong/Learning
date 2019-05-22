const { Given, When, Then } = require('cucumber')
const { expect } = require('chai')

Given('a variable set to {int}', async function(number) {
  await this.setTo(number)
})

When('I increment the variable by {int}', async function(number) {
  await this.incrementBy(number)
})

Then('the variable should contain {int}', async function(number) {
  expect(this.variable).to.eql(number)
})
