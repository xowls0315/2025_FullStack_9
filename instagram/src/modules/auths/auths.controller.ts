import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthsService } from './auths.service';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';

@Controller('auths')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authsService.login(loginDto);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 6 * 60 * 1000, // 10분
    });
    return { accessToken };
  }

  @Post('refresh')
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new UnauthorizedException('refresh token missing');
    const accessToken = this.authsService.validateRefreshToken(refreshToken);
    return { accessToken };
  }
}
