import { Exclude } from 'class-transformer';
import { Length, IsEmail, IsUrl } from 'class-validator';
import { OfferEntity } from 'src/offers/entities/offer.entity';
import { WishEntity } from 'src/wishes/entities/wish.entity';
import { WishListEntity } from 'src/wishLists/entities/wishList.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
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

  @Column({
    type: 'varchar',
    unique: true,
  })
  @Length(2, 30)
  username: string;

  @Column({
    type: 'varchar',
    length: 200,
    default: 'Пока ничего не рассказал о себе',
  })
  about: string;

  @Column({
    type: 'varchar',
    default: 'https://i.pravatar.cc/300',
  })
  @IsUrl()
  avatar: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  @IsEmail()
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @OneToMany(() => WishEntity, (wish) => wish.owner)
  wishes: WishEntity[];

  @OneToMany(() => OfferEntity, (offer) => offer.user)
  offers: OfferEntity[];

  @OneToMany(() => WishListEntity, (wishList) => wishList.owner)
  wishLists: WishListEntity[];
}
