import { CodeHelper } from './utils'
import { EUserScopes, UserService } from './userService'

UserService.createUser('user1', '1')
UserService.createUser('user2', '2')
UserService.createUser('user3', '3')

const lookup = async (query: Object) => {
  const ins = await UserService.findOne(query)
  console.log('lookup', '->', ins)
}

lookup({ lastName: '1' })

for (let i = 0; i < 100; i++) {
  const ran = Math.randomFromRange(1, 200)
  const tmp = CodeHelper.inlineIf(() => ran % 2 === 0, 'even', 'odd')
  const tmp2 = CodeHelper.inlineIf((ran + 1) % 2 === 0, 'even', 'odd')

  console.log(`${ran} -> ${tmp} , ${tmp2}`)
}

const asyncRandom = async () => {
  for (let i = 0; i < 10; i++) {
    const ran = Math.randomFromRange(1, 200)
    const tmp = await CodeHelper.inlineIf(
      Promise.resolve(ran % 2 === 0),
      Promise.resolve('even-pm'),
      Promise.resolve('odd-pm')
    )

    console.log(`${ran} -> ${tmp}`)
  }
}
asyncRandom()
