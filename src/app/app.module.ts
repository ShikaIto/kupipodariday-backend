import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferEntity } from 'src/offers/entities/offer.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { WishEntity } from 'src/wishes/entities/wish.entity';
import { WishListEntity } from 'src/wishLists/entities/wishList.entity';
import { UserModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WishModule } from 'src/wishes/wishes.module';
import { WishListModule } from 'src/wishLists/wishLists.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { OfferModule } from 'src/offers/offers.module';

@Module({
  imports: [
    WinstonModule.forRoot({
      levels: {
        critical_error: 0,
        error: 1,
        special_warning: 2,
        another_log_level: 3,
        info: 4,
      },
      transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
      ],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: new ConfigService().get<string>('DATABASE_HOST'),
      port: Number(new ConfigService().get<string>('DATABASE_PORT')),
      username: new ConfigService().get<string>('DATABASE_USERNAME'),
      password: new ConfigService().get<string>('DATABASE_PASSWORD'),
      database: new ConfigService().get<string>('DATABASE_NAME'),
      entities: [OfferEntity, UserEntity, WishEntity, WishListEntity],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    WishModule,
    WishListModule,
    OfferModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
