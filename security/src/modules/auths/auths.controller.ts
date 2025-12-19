import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthsService } from './auths.service';
import { LoginUserDto } from './dto/login-user.dto';
import type { Request } from 'express';

@Controller('auths')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @Post('login')
  async login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) res) {
    const user = await this.authsService.login(dto);
    const accessToken = await this.authsService.generateAccessToken(user);
    const refreshToken = await this.authsService.generateRefreshToken(user);

    // refreshToken을 브라우저의 쿠키에 저장(XSS 방지를 위해 httpOnly, HTTPS만을 허용을 위해 secure, lax sameSite 설정)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // 클라이언트 JS로 접근 불가 (XSS 보호)
      sameSite: 'lax', // CSRF 공격을 일부 방지
    });

    return accessToken;
  }

  @Post('/refresh')
  async refresh(@Req() request: Request) {
    const { refreshToken } = request.cookies;
    if (!refreshToken)
      throw new UnauthorizedException('리프레쉬 토큰이 없습니다.');
    let payload: any;
    try {
      payload = (this.authsService as any).jwtService.verify(refreshToken);
    } catch (err) {
      throw new UnauthorizedException('유효하지 않은 리프레쉬 토큰입니다.');
    }
    const user = payload.user;
    if (!user)
      throw new UnauthorizedException('리프레쉬 토큰에 유저 정보가 없습니다.');
    return this.authsService.generateAccessToken(user);
  }
}
