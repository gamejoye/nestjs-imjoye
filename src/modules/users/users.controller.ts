import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { UsersService } from './users.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(protected readonly usersService: UsersService) {}
  @Get(':id')
  @UseGuards(JwtGuard)
  async getUserByid(@GetUser() user: User, @Param('id') id: number) {
    if (user.id !== id) {
      throw new HttpException('invaid token', HttpStatus.FORBIDDEN);
    }
    return user;
  }
  @Get(':id/friends')
  @UseGuards(JwtGuard)
  async getFriendsById(@Param('id') id: number) {
    const friends = await this.usersService.getFriends(id);
    return friends;
  }
  @Get(':id/friends/:friendId')
  @UseGuards(JwtGuard)
  async getFriendByUserIdAndFriendId(
    @Param('id') id: number,
    @Param('friendId') friendId: number,
    @Query('detail') detail: 'full' | 'basic',
  ) {
    const friends = await this.usersService.getFriendInfoByUserIdAndFriendId(
      id,
      friendId,
    );
    return friends;
  }
}
