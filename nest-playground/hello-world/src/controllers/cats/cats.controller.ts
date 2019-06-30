import { Controller, Get, Param, Res, HttpStatus, Post } from '@nestjs/common'
import { Response } from 'express'
import { DATAS, add } from './_mock'
import { CatEntity } from './cats.type'

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): CatEntity[] {
    return DATAS
  }

  @Post()
  async add(): Promise<CatEntity> {
    return add()
  }

  @Get('nickName/:name')
  findOne(@Param('name') name: string, @Res() res: Response): any {
    const searchTerm = new RegExp(name.toLowerCase(), 'i')
    const match = DATAS.find(itm => searchTerm.test(itm.nickName))
    res.status(match ? HttpStatus.OK : HttpStatus.NOT_FOUND).json(match)
  }
}
