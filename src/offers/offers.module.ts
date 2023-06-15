import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferEntity } from './entities/offer.entity';
import { OfferService } from './offers.service';
import { WishModule } from 'src/wishes/wishes.module';
import { OfferController } from './offers.controller';

@Module({
  imports: [WishModule, TypeOrmModule.forFeature([OfferEntity])],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {}
