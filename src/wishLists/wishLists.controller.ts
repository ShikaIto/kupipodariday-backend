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
import { JwtGuard } from 'src/guards/jwt.guard';
import { WishListService } from './wishLists.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('wishlistlists')
export class WishListController {
  constructor(private readonly wishListService: WishListService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createWishList(@Body() body, @Req() req) {
    const wishList = await this.wishListService.create(body, req.user);
    return wishList;
  }

  @UseGuards(JwtGuard)
  @Get()
  async getWishLists() {
    const wishLists = await this.wishListService.findAll();
    return wishLists;
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  async getWishList(@Param('id') id) {
    const wishList = await this.wishListService.findById(id);
    return wishList;
  }

  @UseGuards(JwtGuard)
  @Delete('/:id')
  async deleteWishList(@Param('id') id, @Req() req) {
    const result = await this.wishListService.delete(id, req.user);
    return result;
  }

  @UseGuards(JwtGuard)
  @Patch('/:id')
  async updateWishList(@Param('id') id, @Body() body, @Req() req) {
    const wishList = await this.wishListService.update(id, body, req.user);
    return wishList;
  }
}
