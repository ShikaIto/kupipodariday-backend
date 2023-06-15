import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishEntity } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { CreateWishDto } from './entities/create-wish.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { OfferEntity } from 'src/offers/entities/offer.entity';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(WishEntity)
    private readonly wishRepository: Repository<WishEntity>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: UserEntity) {
    const wish = await this.wishRepository.create({
      ...createWishDto,
      owner,
    });

    return this.wishRepository.save(wish);
  }

  async findByOwnerId(id: number) {
    const wishes = await this.wishRepository.find({
      where: { owner: { id } },
    });
    return wishes;
  }

  async findById(id: number) {
    const wish = await this.wishRepository.findOne({
      relations: {
        owner: true,
        offers: true,
      },
      where: { id },
    });
    return wish;
  }

  async update(id: number, createWishDto: CreateWishDto, owner: UserEntity) {
    let wish = await this.findById(id);
    if (wish.owner.id !== owner.id) {
      throw new BadRequestException('Нельзя редактировать чужие желания');
    }

    await this.wishRepository.update(id, {
      updatedAt: new Date(),
      ...createWishDto,
    });
    wish = await this.findById(id);
    return wish;
  }
  async updateWithOffer(id: number, amount: number, offer: OfferEntity) {
    let wish = await this.findById(id);
    await this.wishRepository.update(id, {
      updatedAt: new Date(),
      offers: [...wish.offers, offer],
      raised: wish.raised + amount,
    });
    wish = await this.findById(id);
    return wish;
  }

  async delete(id: number, owner: UserEntity) {
    const wish = await this.findById(id);
    if (wish.owner.id !== owner.id) {
      throw new BadRequestException('Нельзя удалять чужие желания');
    }
    await this.wishRepository.delete({ id });
    return { message: 'Успешно удалено' };
  }

  async copied(id: number, owner: UserEntity) {
    const wish = await this.findById(id);
    await this.wishRepository.update(id, { copied: wish.copied + 1 });
    const copyWish = await this.wishRepository.create({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner,
    });
    return this.wishRepository.save(copyWish);
  }

  async findTop() {
    const wishes = await this.wishRepository.find({
      relations: {
        owner: true,
      },
      order: {
        copied: 'DESC',
      },
      take: 10,
    });
    return wishes;
  }

  async findLast() {
    const wishes = await this.wishRepository.find({
      relations: {
        owner: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
    return wishes;
  }
}
