import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { UsersService } from './users.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { EnvConfigService } from '../env-config/env-config.service';
import { Response } from 'express';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    protected readonly usersService: UsersService,
    protected readonly envConfigService: EnvConfigService,
  ) {}
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
    if (detail === 'full') {
      const friends = await this.usersService.getFriendInfoByUserIdAndFriendId(
        id,
        friendId,
      );
      return friends;
    } else {
      // TODO 不获取friendInfo 而是只获取friend: IUser
      const friends = await this.usersService.getFriendInfoByUserIdAndFriendId(
        id,
        friendId,
      );
      return friends;
    }
  }
  @Post('avatar/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Res({ passthrough: true }) res: Response,
  ) {
    const filename = file.filename;
    const avatarUrl = this.envConfigService.getAvatarConfig().avatarUrl;
    const userAvatarUrl = avatarUrl + '/' + filename;
    return userAvatarUrl;
  }
}
