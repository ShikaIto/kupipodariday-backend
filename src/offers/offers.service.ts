import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferEntity } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { WishService } from 'src/wishes/wishes.service';
import { CreateOfferDto } from './entities/create-offer.dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(OfferEntity)
    private readonly offerRepository: Repository<OfferEntity>,
    private readonly wishService: WishService,
  ) {}

  async create(createOfferDto: CreateOfferDto, owner: UserEntity) {
    const wish = await this.wishService.findById(createOfferDto.itemId);
    if (wish.owner.id === owner.id) {
      throw new BadRequestException('Нельзя скидываться на свои желания');
    }
    const offer = await this.offerRepository.create({
      amount: createOfferDto.amount,
      hidden: createOfferDto.hidden,
      item: wish,
      owner,
    });

    await this.wishService.updateWithOffer(
      wish.id,
      createOfferDto.amount,
      offer,
    );

    return this.offerRepository.save(offer);
  }

  async findById(id: number) {
    const offer = await this.offerRepository.findOne({
      relations: {
        owner: true,
        item: true,
      },
      where: { id },
    });
    return offer;
  }

  async findAll() {
    const offers = await this.offerRepository.find({
      relations: {
        owner: true,
        item: true,
      },
    });
    return offers;
  }
}
