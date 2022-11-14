import { Controller, Headers, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  signin(@Req() req: any) {
    return this.authService.signin(req.user);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refresh(@Headers() headers: Record<string, string>) {
    return {
      refresh_token: headers['authorization'].replace('Bearer', '').trim(),
    };
  }
}
