import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferEntity } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './entities/create-offer.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { WishService } from 'src/wishes/wishes.service';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(OfferEntity)
    private readonly offerRepository: Repository<OfferEntity>,
    private readonly wishService: WishService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: UserEntity) {
    const { itemId, hidden, amount } = createOfferDto;
    const wish = await this.wishService.findById(itemId);
    if (wish.owner.id === user.id) {
      throw new BadRequestException('Нельзя скидываться на свои желания');
    } else if (wish.raised + amount > wish.price) {
      throw new BadRequestException(
        'Нельзя скидывать сумму превышающую стоимость',
      );
    }

    const offer = await this.offerRepository.create({
      amount,
      hidden,
      item: wish,
      user,
    });

    await this.wishService.updateRaised(wish, amount);

    return this.offerRepository.save(offer);
  }

  async findById(id: number) {
    const offer = await this.offerRepository.findOne({
      relations: {
        user: true,
        item: true,
      },
      where: { id },
    });
    return offer;
  }

  async findAll() {
    const offers = await this.offerRepository.find({
      relations: {
        user: true,
        item: true,
      },
    });
    return offers;
  }
}
