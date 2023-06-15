import { IsUrl, Length } from 'class-validator';
import { OfferEntity } from 'src/offers/entities/offer.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class WishEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'date',
    default: new Date(),
  })
  createdAt: Date;

  @Column({
    type: 'date',
    default: new Date(),
  })
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  price: number;

  @Column({ default: 0 })
  raised: number;

  @ManyToOne(() => UserEntity, (user) => user.wishes)
  owner: UserEntity;

  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => OfferEntity, (offer) => offer.item)
  offers: OfferEntity[];

  @Column({ default: 0 })
  copied: number;
}
