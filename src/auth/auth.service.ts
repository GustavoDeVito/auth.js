import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signin(user) {
    const access_token = { sub: user.id, name: user.name };
    const refresh_token = { sub: user.id };

    return {
      access_token: this.jwtService.sign(access_token),
      refresh_token: this.jwtService.sign(refresh_token),
      expiresIn: 0,
    };
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUser(username);

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
