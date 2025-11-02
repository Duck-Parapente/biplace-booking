import { Module } from '@nestjs/common';

const httpControllers = [];

@Module({
  imports: [],
  controllers: [...httpControllers],
  providers: [],
})
export class UserModule {}
