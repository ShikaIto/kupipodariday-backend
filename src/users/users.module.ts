import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { BcryptModule } from 'nest-bcrypt';
import { WishModule } from 'src/wishes/wishes.module';

@Module({
  imports: [
    WishModule,
    TypeOrmModule.forFeature([UserEntity]),
    BcryptModule.register({ salt: 10 }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
