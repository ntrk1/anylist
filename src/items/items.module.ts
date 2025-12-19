import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { itemProviders } from 'src/typeOrm/item.provider';
import { databaseProviders } from 'src/typeOrm/database.provider';

@Module({
  providers: [
    ItemsResolver, 
    ItemsService, 
    ...itemProviders,
    ...databaseProviders
  ],
  imports: [],
})
export class ItemsModule {}
