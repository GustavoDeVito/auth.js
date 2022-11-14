import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './stratagies/local.stratagies';
import { JwtStrategyAccess } from './stratagies/accessToken.stratagies';
import { RefreshTokenStrategy } from './stratagies/refreshToken.stratagies';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategyAccess,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
