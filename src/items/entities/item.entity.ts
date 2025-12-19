import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'Items'})
@ObjectType()
export class Item {

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Field(() => String)
  @Column()
  name: string;


  @Field(() => Float)
  @Column()
  quantity: number;


  @Field(() => String, {nullable: true})
  @Column({nullable: true})
  unidadMedida?: string;
}
