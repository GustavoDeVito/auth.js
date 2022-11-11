import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signin(@Req() req: any) {
    return await this.authService.signin(req.user);
  }

  @Post('refresh')
  @UseInterceptors(FileInterceptor('file'))
  refresh(@Body() { refresh_token }: { refresh_token: string }) {
    return refresh_token;
  }
}
