import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { ValidRolesArgs } from './dto/args/roles.args';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwy-auth.guards';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import { UUID } from 'typeorm/driver/mongodb/bson.typings.js';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}


  @Query(() => [User], { name: 'findAll' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<User[]> {
    console.log(user);
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'finOne' })
  findOne(@Args('id', { type: () => ID}, ParseUUIDPipe) id: string,  
  @CurrentUser([ValidRoles.admin]) user: User
 ): Promise<User> {
    return this.usersService.findById(id);
  }


  @Mutation(() => User, { name: 'blockUser' })
  bolckUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User): Promise<User> {
    return this.usersService.block(id, user);
  }

  @Mutation(() => User, {name: 'updateUser'})
    async UpdateUser(
      @Args('id') updateUser: UpdateUserInput,
      @CurrentUser([ValidRoles.admin]) user: User
    ): Promise<User> {
      return this.usersService.update(updateUser.id, updateUser, user)
    }
}
