import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    // get user from database by email
    const user = await this.usersService.getByEmail(email);
    console.log('user: ', user);
    const correct =
      user !== null && (await bcrypt.compare(password, user.passwordHash));
    console.log('correct: ', correct);
    if (!correct) {
      throw new HttpException(
        'email or password invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
