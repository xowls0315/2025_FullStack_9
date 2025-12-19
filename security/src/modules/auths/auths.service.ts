import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/user.entity';
import { Refreshtokens } from './entities/refreshToken.entity';

@Injectable()
export class AuthsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Refreshtokens)
    private readonly refreshRepo: Repository<Refreshtokens>,
  ) {}

  // ✅ 1) 로그인 검증: "유저" 반환 (토큰은 컨트롤러에서 생성)
  async login(dto: LoginUserDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user)
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다.');

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok)
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다.');

    return user;
  }

  // ✅ 2) Access Token 생성
  async generateAccessToken(user: Users) {
    const payload = {
      sub: user.id, // 표준 관례: sub = userId
      email: user.email,
      tier: 'bronze',
    };

    // JwtModule.register / registerAsync에서 설정한 secret/signOptions(issuer/expiresIn) 사용됨
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(user: Users) {
    const refreshToken = this.jwtService.sign(
      {
        user: user,
      },
      {
        expiresIn: '1h',
      },
    );

    const hashToken = await bcrypt.hash(refreshToken, 10);

    const newRefreshToken = this.refreshRepo.create({
      user: user,
      token: hashToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    await this.refreshRepo.save(newRefreshToken);
    return refreshToken;
  }
}
