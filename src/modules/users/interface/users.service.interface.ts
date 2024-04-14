import { User } from '../entities/user.entity';

export interface IUsersService {
  getByEmail(email: string): Promise<User | null>;
  getById(id: number): Promise<User | null>;
  register(
    username: string,
    email: string,
    passwordHash: string,
    avatarUrl: string,
  ): Promise<User>;
  getFriends(userId: number): Promise<Array<User>>;
}
