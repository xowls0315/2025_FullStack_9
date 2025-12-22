import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../refresh-token/entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/user.entity';
import { LoginDto } from './entities/login.dto';
import * as bcrypt from 'bcrypt';
import { TokensService } from './tokens.service';

@Injectable()
export class AuthsService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
    @InjectRepository(Users) private readonly usersRepo: Repository<Users>,
    private tokenService: TokensService,
  ) {}

  async login(loginDto: LoginDto) {
    const { id, password } = loginDto;
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('아이디를 확인해주세요');

    const isSame = await bcrypt.compare(password, user.hashedPassword);
    if (!isSame) throw new NotFoundException('비밀번호를 확인해주세요');

    const accessToken = this.tokenService.generateAccessToken(user.id);
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);

    return { accessToken, refreshToken };

    // loginDto(아이디/비밀번호)
    // 성공 케이스
    // -0. 토큰서비스.ts를 만들고
    // 1) 엑세스 토큰 발급 함수
    // 2) 리프레쉬 토큰 발급 함수
    // 3) 모든 토큰 유효성 검증 함수
    // 4) 리프레쉬 토큰 데이터베이스 조회 함수
    // -1. 엑세스 토큰[]
    // -2. 리프레쉬 토큰[DB]
  }

  async validToken(token: string) {
    return this.tokenService.validateAccessToken(token);
  }

  async validRefreshToken(refreshToken: string) {
    return this.tokenService.validateRefreshToken(refreshToken);
  }

  async logout() {}
}
