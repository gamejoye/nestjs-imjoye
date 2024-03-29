import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: ['jwt', 'local'],
    }),
  ],
  providers: [LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
