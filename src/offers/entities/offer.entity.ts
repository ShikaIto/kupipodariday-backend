import { UserEntity } from 'src/users/entities/user.entity';
import { WishEntity } from 'src/wishes/entities/wish.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OfferEntity {
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

  @ManyToOne(() => UserEntity, (user) => user.offers)
  owner: UserEntity;

  @ManyToOne(() => WishEntity, (wish) => wish.offers)
  item: WishEntity;

  @Column()
  amount: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  hidden: boolean;
}
