import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';
import { SingUpInput } from 'src/auth/dto/inputs/singup.input';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import e from 'express';

@Injectable()
export class UsersService {

  private logger = new Logger('UserService')
  constructor(
      @Inject('USER_REPOSITORY')
      private userRepository: Repository<User>,
    ) {}


    private handleDBErrors( error: any): never {
      this.logger.error(error);
      if (error.code === '23505') {
        throw new BadRequestException(error.detail.replace('Key', ''))
      }
      if (error.code === 'error-001') {
        throw new BadRequestException(error.detail.replace('Key', ''))
      }
      throw new InternalServerErrorException('error en el handler')
    }


  async create(singupInput: SingUpInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...singupInput,
        password: bcrypt.hashSync(singupInput.password, 10)});
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error)
    }
  }




  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0) return this.userRepository.find({
      //implementado sin lazy
      // relations: {
      //   manipulado: true
      // }
    });

    return this.userRepository.createQueryBuilder()
    .andWhere('ARRAY[roles] && ARRAY[:...roles]')
    .setParameter('roles', roles)
    .getMany();
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({email});
    } catch (error) {
      this.handleDBErrors({
        code: 'error-001',
        detail: `correo: '${email}' no registrado`
      });
    }
  }

  async findById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({id});
    } catch (error) {
      this.handleDBErrors({
        code: 'error-001',
        detail: `correo: '${id}' no registrado`
      });
    }
  }


  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findById(id);
    userToBlock.isOnline = false;
    userToBlock.manipulado = adminUser;
    return await this.userRepository.save(userToBlock);
  }

  async update(
    id: string, 
    updateUserInput: UpdateUserInput, 
    updateBy: User
  ): Promise<User> {
    try {
      const user = await this.userRepository.preload({
        ...updateUserInput, id});
      
        user!.manipulado = updateBy;
      return await this.userRepository.save(user!)
    } catch (error) {
      this.handleDBErrors(error)
    }
  }

}
