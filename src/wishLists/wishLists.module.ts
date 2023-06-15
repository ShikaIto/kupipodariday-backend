import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishListEntity } from './entities/wishList.entity';
import { WishListController } from './wishLists.controller';
import { WishListService } from './wishLists.service';
import { WishModule } from 'src/wishes/wishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([WishListEntity]), WishModule],
  controllers: [WishListController],
  providers: [WishListService],
})
export class WishListModule {}
