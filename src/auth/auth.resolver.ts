import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './types/auth-response.type';
import { SingInInput, SingUpInput } from './dto/inputs';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwy-auth.guards';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';


@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, {name: 'singUp'})
  async signup(
    @Args('singupInput') singupInput: SingUpInput
  ): Promise<AuthResponse> {
    return this.authService.signup(singupInput);
  }

   @Mutation(() => AuthResponse, {name: 'singIn'})
   async signin(
    @Args('singinInput') singinInput: SingInInput
   ): Promise<AuthResponse> {
     return this.authService.singin(singinInput);
   }

   @Query(() => AuthResponse, {name: 'revalidate'})
   @UseGuards(JwtAuthGuard)
    revalidate(
      @CurrentUser([ValidRoles.admin]) user: User
    ): AuthResponse {
      return this.authService.validateToken(user);
   }
   }



