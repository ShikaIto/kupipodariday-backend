import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishEntity } from './entities/wish.entity';
import { WishService } from './wishes.service';
import { WishController } from './wishes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WishEntity])],
  controllers: [WishController],
  providers: [WishService],
  exports: [WishService],
})
export class WishModule {}
