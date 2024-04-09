import { Inject, Injectable } from '@nestjs/common';
import { IUsersService } from './interface/users.service.interface';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { USER_REPOSITORY } from 'src/common/constants/providers';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    protected usersRepository: Repository<User>,
  ) {}
  async getById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user;
  }
  async register(
    username: string,
    email: string,
    passwordHash: string,
    avatarUrl: string,
  ): Promise<User> {
    const partial = this.usersRepository.create({
      username,
      email,
      passwordHash,
      avatarUrl,
    });
    const user = await this.usersRepository.save(partial);
    return user;
  }
  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    return user;
  }
}
