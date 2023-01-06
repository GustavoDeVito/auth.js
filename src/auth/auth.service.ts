import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { SigninI } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async token(user): Promise<SigninI> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          name: user.name,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    const token = this.jwtService.decode(accessToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: token['exp'],
    };
  }

  async refreshToken({ refreshToken: token }: { refreshToken: string }) {
    try {
      const payload = this.jwtService.decode(token);

      const id = payload['sub'];

      const user = await this.userService.findOne(id);

      return await this.token(user);
    } catch (error) {
      throw new UnauthorizedException();
    }
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
