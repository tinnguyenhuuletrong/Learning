import { CodeHelper, Debug } from './utils'
import { EUserScopes, UserService } from './userService'

UserService.createUser('user1', '1')
UserService.createUser('user2', '2')
UserService.createUser('user3', '3')

const lookup = async (query: Object) => {
  const ins = await UserService.findOne(query)
  console.log('lookup', '->', ins)
}

lookup({ lastName: '1' })

const random = () => {
  for (let i = 0; i < 100; i++) {
    const ran = Math.randomFromRange(1, 200)
    const tmp = CodeHelper.inlineIf(() => ran % 2 === 0, 'even', 'odd')
    const tmp2 = CodeHelper.inlineIf((ran + 1) % 2 === 0, 'even', 'odd')

    Debug.log({ name: 'random1', value: `${ran} -> ${tmp} , ${tmp2}` })
  }
}

const asyncRandom = async () => {
  for (let i = 0; i < 10; i++) {
    const ran = Math.randomFromRange(1, 200)
    const tmp = await CodeHelper.inlineIf(
      Promise.resolve(ran % 2 === 0),
      Promise.resolve('even-pm'),
      Promise.resolve('odd-pm')
    )

    Debug.log({ name: 'random2', value: `${ran} -> ${tmp}` })
  }
}

const castCode = () => {
  const strJson = JSON.stringify({ a: 1, b: 2, c: 3 })
  type ExpectDataLoaded = {
    a: number
    b: number
    c: number
  }

  // Auto complete helper
  const tmp = CodeHelper.castJson<ExpectDataLoaded>(strJson)
  console.log(tmp.b)
}
castCode()
