import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @Inject('ITEM_REPOSITORY')
    private itemRepository: Repository<Item>,
  ) {}


  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = this.itemRepository.create(createItemInput);
    return await this.itemRepository.save(newItem);
  }

  async findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemRepository.findOneBy({id})
    if(!item) throw new NotFoundException();
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput
  ): Promise<Item> {
    const item = await this.itemRepository.preload(updateItemInput)
    if(!item) throw new NotFoundException();
    return this.itemRepository.save(item!)
  }

  async remove(id: string): Promise<Item> {
    const item = await this.findOne(id);

    await this.itemRepository.remove(item);
    return {...item, id};
  }
}
