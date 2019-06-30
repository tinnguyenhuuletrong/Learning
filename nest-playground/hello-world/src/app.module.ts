import { Module } from '@nestjs/common'
import { AppController } from './controllers/app.controller'
import { CatsController } from './controllers/cats/cats.controller'
import { AppService } from './app.service'

@Module({
  imports: [],
  controllers: [AppController, CatsController],
  providers: [AppService],
})
export class AppModule {}
