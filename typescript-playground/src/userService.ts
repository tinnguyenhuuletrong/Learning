import { commandLogDecorator } from './decorator'
import { v4 } from 'uuid'
import { find } from 'lodash'

enum EUserScopes {
  EUpdatePersonalData = 'update_personal_data',
  ELogin = 'login'
}

class UserModel {
  public _id: string = ''
  public firstName: string = ''
  public lastName: string = ''
  public scopes: Array<EUserScopes> = [
    EUserScopes.ELogin,
    EUserScopes.EUpdatePersonalData
  ]

  public toString() {
    const { firstName, lastName } = this
    return `${firstName} ${lastName}`
  }
}

class UserService {
  private static DB: UserModel[] = []

  @commandLogDecorator('USER_CREATE')
  public static createUser(firstName: string, lastName: string): UserModel {
    const ins = new UserModel()
    ins._id = v4()
    ins.firstName = firstName
    ins.lastName = lastName

    UserService.DB.push(ins)
    return ins
  }

  public static async findOne(query: Object): Promise<UserModel | undefined> {
    return await find(UserService.DB, { ...query })
  }
}

export { UserService, UserModel, EUserScopes }
