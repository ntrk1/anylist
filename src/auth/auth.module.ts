import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { envs } from 'src/config';

@Module({
  providers: [AuthResolver, AuthService, 
    JwtStrategy
  ],
  exports: [
    JwtStrategy, 
    PassportModule, JwtModule],
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      useFactory: () => ({
          secret: envs.jwt,
          signOptions: {
            expiresIn: '4h'
        }
      })
    }),
    UsersModule,
  ]
})
export class AuthModule {}
