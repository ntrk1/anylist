import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'users'})
@ObjectType()
export class User {
  
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  fullName: string;

  @Field(() => String)
  @Column({unique: true})
  email: string;


  @Column()
  password: string;

  @Field(() => [String])
  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  roles: string[];

  @Field(() => Boolean)
  @Column({
    type: 'boolean',
    default: true
  })
  isOnline: boolean;

  @Field(() => User, {nullable: true, name: 'editBy'})
  @ManyToOne(() => User, (user) => user.manipulado, {nullable: true, lazy: true})
  @JoinColumn({name: 'dirty'})
  manipulado?: User;
}
