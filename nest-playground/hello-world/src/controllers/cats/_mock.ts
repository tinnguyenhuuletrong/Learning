import * as jsf from 'json-schema-faker'
import * as faker from 'faker'
import { CatEntity } from './cats.type'
import { async } from 'rxjs/internal/scheduler/async'

jsf.extend('faker', () => faker)

const CatSchemaFaker = {
  type: 'object',
  properties: {
    nickName: {
      type: 'string',
      faker: 'internet.userName',
    },
    type: {
      type: 'string',
      enum: ['British Shorthair', 'Persian cat'],
    },
    picUrl: {
      type: 'string',
      faker: {
        'image.cats': [256, 256, true],
      },
    },
  },
  required: ['nickName', 'type', 'picUrl'],
}

const DATAS: CatEntity[] = Array(6)
  .fill(0)
  .map(itm => jsf.generate(CatSchemaFaker))

async function add(itm?: CatEntity): Promise<CatEntity> {
  const obj: CatEntity = itm ? itm : jsf.generate(CatSchemaFaker)
  DATAS.push(obj)
  return obj
}

export { DATAS, add }
