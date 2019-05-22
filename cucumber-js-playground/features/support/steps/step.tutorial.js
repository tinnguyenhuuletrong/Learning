const { Given, When, Then } = require('cucumber')
const assert = require('assert')

const INVENTORY_KEY = 'cucumber-num'
const BALANCE_KEY = 'usd-num'
const PRICE_PER_ITEM = 'price-one-cumber'

Given('I have {int} cucumbers in my bag', async function(cucumberCount) {
  await this.setKey(INVENTORY_KEY, cucumberCount)
})

Given('I have {int} USD in my bag', async function(amount) {
  await this.setKey(BALANCE_KEY, amount)
})

Given('{float} cucumber = {float} USD', async function(amount, moneyAmount) {
  await this.setKey(PRICE_PER_ITEM, moneyAmount / amount)
})

When('I {word} {int} cucumbers -> {word}', async function(
  action,
  amount,
  expectation
) {
  try {
    const balance = await this.getKey(INVENTORY_KEY)
    const money = await this.getKey(BALANCE_KEY)
    const pricePerItem = await this.getKey(PRICE_PER_ITEM)

    switch (action) {
      case 'sell':
        {
          const price = pricePerItem * amount

          await this.setKey(BALANCE_KEY, money + price)
          await this.setKey(INVENTORY_KEY, balance - amount)
        }
        break
      case 'buy':
        {
          const price = pricePerItem * amount
          if (money < price)
            throw new Error(`not enough money ${money} vs ${price}`)
          await this.setKey(BALANCE_KEY, money - price)
          await this.setKey(INVENTORY_KEY, balance + amount)
        }
        break
      default:
        throw new Error(`unknown action ${action}`)
    }
    assert(expectation === 'success')
  } catch (error) {
    // console.warn(error)
    assert(expectation === 'failed')
  }
})

Then('Then I have {int} cucumbers in my bag', async function(amount) {
  const balance = await this.getKey(INVENTORY_KEY)
  assert(balance === amount)
})
