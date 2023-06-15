import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/users.service';
import { BcryptService } from 'nest-bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
  ) {}

  auth(user: UserEntity) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.userService.findMany(username);

    const matched = await this.bcryptService.compare(password, user.password);
    if (matched) {
      return user;
    }

    return null;
  }
}
