import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthResponse } from './types/auth-response.type';
import { SingUpInput } from './dto/inputs/singup.input';
import { UsersService } from 'src/users/users.service';
import { SingInInput } from './dto/inputs/singin.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) {}
    private getJwtToken(userid: string) {
        return this.jwtService.sign({id: userid});
    }

    async signup(singupInput: SingUpInput): Promise<AuthResponse> {
        const user = await this.userService.create(singupInput);
        const token = this.getJwtToken(user.id);

        return {token, user};
    }

    async singin({email, password}: SingInInput): Promise<AuthResponse> {
        const user = await this.userService.findByEmail(email);
        if (!bcrypt.compareSync(password, user.password)) {
            throw new BadRequestException('datos incorrectos')
        }
        const token = this.getJwtToken(user.id);
        return {
            token,
            user
        }
    }

    
  async validateUser(id: string): Promise<User> {
    const user = await this.userService.findById(id);
    if(!user.isOnline)
        throw new UnauthorizedException('no autorizado');
   
    return user;
  }

  validateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);

    return {token, user};
  }


}
