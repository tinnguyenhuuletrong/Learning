import { UserModel, UserService } from './userService'

UserService.createUser('user1', '1')
UserService.createUser('user2', '2')
UserService.createUser('user3', '3')

const lookup = async (query: Object) => {
  const ins = await UserService.findOne(query)
  console.log('lookup', '->', ins)
}
lookup({ lastName: '1' })
