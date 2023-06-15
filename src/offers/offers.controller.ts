import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OfferService } from './offers.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { CreateOfferDto } from './entities/create-offer.dto';

@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createOffer(@Body() body: CreateOfferDto, @Req() req) {
    const offer = await this.offerService.create(body, req.user);
    return offer;
  }

  @UseGuards(JwtGuard)
  @Get()
  async getOffers() {
    const offers = await this.offerService.findAll();
    return offers;
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  async getOffer(@Param('id') id) {
    const offer = await this.offerService.findById(id);
    return offer;
  }
}
