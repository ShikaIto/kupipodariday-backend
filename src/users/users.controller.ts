import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt.guard';
import { UserService } from './users.service';
import { WishService } from 'src/wishes/wishes.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly wishService: WishService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('/me')
  profile(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtGuard)
  @Patch('/me')
  async updateUser(@Req() req, @Body() body) {
    const user = await this.userService.update(req.user.id, { ...body });
    return user;
  }

  @UseGuards(JwtGuard)
  @Get('/:username')
  async getUser(@Param('username') username: string) {
    const user = await this.userService.findMany(username);
    return user;
  }

  @UseGuards(JwtGuard)
  @Post('/find')
  async findUser(@Body() body) {
    const user = await this.userService.findMany(body.query);
    return user;
  }

  @UseGuards(JwtGuard)
  @Get('/me/wishes')
  async getUserWishes(@Req() req) {
    const wishes = await this.wishService.findByOwnerId(req.user.id);
    return wishes;
  }

  @UseGuards(JwtGuard)
  @Get('/:username/wishes')
  async getWishes(@Param('username') username: string) {
    const user = await this.userService.findMany(username);
    const wishes = await this.wishService.findByOwnerId(user.id);
    return wishes;
  }
}
