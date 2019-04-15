import { v4 } from 'uuid'
import { find } from 'lodash'

class UserModel {
  public _id: string = v4()
  public firstName: string = ''
  public lastName: string = ''

  public toString() {
    const { firstName, lastName } = this
    return `${firstName} ${lastName}`
  }
}

class UserService {
  private static DB: UserModel[] = []

  public static createUser(firstName: string, lastName: string): UserModel {
    const ins = new UserModel()
    ins.firstName = firstName
    ins.lastName = lastName

    UserService.DB.push(ins)
    return ins
  }

  public static async findOne(query: Object): Promise<UserModel | undefined> {
    return await find(UserService.DB, { ...query })
  }
}

export { UserService, UserModel }
