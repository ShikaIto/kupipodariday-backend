import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './entities/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { BcryptService } from 'nest-bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly bcryptService: BcryptService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, email, username } = createUserDto;

    const checkEmail = await this.findMany(email);
    const checkUsername = await this.findMany(username);
    if (checkEmail || checkUsername) {
      throw new ConflictException(
        'Пользователь с таким именем или почтой уже существует',
      );
    }

    const hash = await this.bcryptService.hash(password, 10);
    const user = await this.userRepository.create({
      ...createUserDto,
      password: hash,
    });

    return this.userRepository.save(user);
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    return user;
  }

  async findMany(query: string) {
    const user = await this.userRepository.findOne({
      where: [{ email: query }, { username: query }],
    });

    return user;
  }

  async update(id: number, createUserDto: CreateUserDto) {
    if (createUserDto.password) {
      const { password } = createUserDto;
      const hash = await this.bcryptService.hash(password, 10);
      await this.userRepository.update(id, {
        ...createUserDto,
        password: hash,
      });
    } else {
      await this.userRepository.update(id, {
        updatedAt: new Date(),
        ...createUserDto,
      });
    }

    const user = await this.findById(id);

    return user;
  }
}
