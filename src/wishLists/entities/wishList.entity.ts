import { IsUrl, Length } from 'class-validator';
import { UserEntity } from 'src/users/entities/user.entity';
import { WishEntity } from 'src/wishes/entities/wish.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class WishListEntity {
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

  @Column({
    type: 'varchar',
    length: 1500,
    default: 'Ничего не рассказали',
  })
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => UserEntity, (user) => user.wishLists)
  owner: UserEntity;

  @ManyToMany(() => WishEntity)
  @JoinTable()
  items: WishEntity[];
}
