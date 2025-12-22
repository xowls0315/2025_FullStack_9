import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthsService } from './auths.service';
import { LoginDto } from './entities/login.dto';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@Controller('auths')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authsService.login(loginDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: true, // 프로덕션 환경에서는 true로(HTTPS)
      sameSite: 'strict',
      maxAge: 10 * 60 * 1000, // 10분
    });

    return { accessToken };
  }

  @Post('/validToken')
  validToken(@Body() dto: { token: string }) {
    return this.authsService.validToken(dto.token);
  }

  // AuthGuard 가드 만들기
  // 0. auths/test -> "아롬베이크"
  // 1. access token 존재하는지
  // - Bearer ...
  // 2. access token 유효한지
  // -
  @UseGuards(JwtAuthGuard)
  @Get('/test')
  test(@Req() req: Request) {
    // (선택) req.user 확인 가능
    // console.log((req as any).user);
    return '아롬베이크';
  }

  @Post('/refresh')
  async validRefresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      throw new UnauthorizedException('Refresh Token이 없습니다.');

    const result = await this.authsService.validRefreshToken(refreshToken);

    // 새 refreshToken이 온 경우(재갱신) -> 쿠키 교체
    if (result.refreshToken) {
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 10 * 60 * 1000,
      });
    }

    // accessToken은 항상 반환
    return { accessToken: result.accessToken };
  }

  @Post('/logout')
  logout() {}
}
