import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { userProviders } from 'src/typeOrm/item.provider';
import { databaseProviders } from 'src/typeOrm/database.provider';

@Module({
  providers: [
    UsersResolver, 
    UsersService,
    ...userProviders,
    ...databaseProviders
  ],
  imports: [],
  exports: [
    UsersService
  ]
})
export class UsersModule {}
