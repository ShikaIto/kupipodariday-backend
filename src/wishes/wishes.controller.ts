import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { WishService } from './wishes.service';
import { JwtGuard } from 'src/guards/jwt.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('wishes')
export class WishController {
  constructor(private readonly wishService: WishService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createWish(@Body() body, @Req() req) {
    const wish = await this.wishService.create(body, req.user);
    return wish;
  }

  @Get('/top')
  async getWishTop() {
    const wishes = await this.wishService.findTop();
    return wishes;
  }

  @Get('/last')
  async getWishLast() {
    const wishes = await this.wishService.findLast();
    return wishes;
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  async getWish(@Param('id') id: number) {
    const wish = await this.wishService.findById(id);
    return wish;
  }

  @UseGuards(JwtGuard)
  @Patch('/:id')
  async updateWish(@Param('id') id: number, @Body() body, @Req() req) {
    const wish = await this.wishService.update(id, body, req.user);
    return wish;
  }

  @UseGuards(JwtGuard)
  @Delete('/:id')
  async deleteWish(@Param('id') id: number, @Req() req) {
    await this.wishService.delete(id, req.user);
  }

  @UseGuards(JwtGuard)
  @Post('/:id/copy')
  async copiedWish(@Param('id') id: number, @Req() req) {
    const wish = await this.wishService.copied(id, req.user);
    return wish;
  }
}
