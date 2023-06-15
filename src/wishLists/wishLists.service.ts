import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { WishListEntity } from './entities/wishList.entity';
import { CreateWishListDto } from './entities/create-wishList.dto';
import { WishService } from 'src/wishes/wishes.service';

@Injectable()
export class WishListService {
  constructor(
    @InjectRepository(WishListEntity)
    private readonly wishListRepository: Repository<WishListEntity>,
    private readonly wishService: WishService,
  ) {}

  async create(createWishDto: CreateWishListDto, owner: UserEntity) {
    const items = await Promise.all(
      createWishDto.itemsId.map(async (id) => {
        const wish = await this.wishService.findById(Number(id));
        return wish;
      }),
    );
    const wishList = await this.wishListRepository.create({
      ...createWishDto,
      items,
      owner,
    });

    return this.wishListRepository.save(wishList);
  }

  async findAll() {
    const wishLists = await this.wishListRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
    return wishLists;
  }

  async findById(id: number) {
    const wishList = await this.wishListRepository.findOne({
      relations: {
        owner: true,
        items: true,
      },
      where: { id },
    });
    return wishList;
  }

  async delete(id: number, owner: UserEntity) {
    const wishList = await this.findById(id);
    if (wishList.owner.id !== owner.id) {
      throw new BadRequestException('Нельзя удалять чужие списки');
    }
    await this.wishListRepository.delete({ id });
    return { message: 'Успешно удалено' };
  }

  async update(
    id: number,
    createWishDto: CreateWishListDto,
    owner: UserEntity,
  ) {
    let wishList = await this.findById(id);
    if (wishList.owner.id !== owner.id) {
      throw new BadRequestException('Нельзя редактировать чужие списки');
    }

    const items = await Promise.all(
      createWishDto.itemsId.map(async (id) => {
        const wish = await this.wishService.findById(Number(id));
        return wish;
      }),
    );
    await this.wishListRepository.update(id, {
      updatedAt: new Date(),
      ...createWishDto,
      items,
    });
    wishList = await this.findById(id);
    return wishList;
  }
}
