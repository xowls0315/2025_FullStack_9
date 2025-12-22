import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../refresh-token/entities/refresh-token.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  // 1) 엑세스 토큰 발급 함수
  generateAccessToken(userId: number) {
    return this.jwtService.sign({ sub: userId }, { expiresIn: '3m' });
  }

  validateAccessToken(token: string) {
    return this.jwtService.verify(token);
  }

  // 2) 리프레쉬 토큰 발급 함수
  async generateRefreshToken(userId: number) {
    // // ✅ A안: 로그인 시 기존 토큰 전부 isRevoked = true
    // await this.refreshTokenRepo.update(
    //   { userId, isRevoked: false },
    //   { isRevoked: true },
    // );

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '10m' },
    );
    const hashedToken = await bcrypt.hash(refreshToken, 10);

    const target = await this.refreshTokenRepo.findOne({ where: { userId } });
    if (!target)
      throw new UnauthorizedException('타겟 Refresh Token이 없습니다.');
    await this.refreshTokenRepo.delete({ userId }); // 기존 리프레쉬 토큰들 삭제함

    const newToken = this.refreshTokenRepo.create({
      hashedToken,
      userId,
      isRevoked: false,
      expireAt: new Date(Date.now() + 10 * 60 * 1000), // 10분 후 만료
    });

    await this.refreshTokenRepo.save(newToken);

    return refreshToken;
  }

  // 3) 모든 토큰 유효성 검증 함수
  // 4) 리프레쉬 토큰 데이터베이스 조회 함수
  /**
   * refresh 검증 + 재로그인 정책 적용
   * - 1) 토큰 자체(jwt) 유효성 검증
   * - 2) payload.sub(userId) 추출
   * - 3) DB에 해당 userId row 있는지 확인
   *    - 있으면: DB에 저장된 해시와 compare 해서 유효하면 access 발급
   *    - 없으면: 새 refresh 발급/저장 + access 발급 (재갱신)
   *
   * return:
   *  - accessToken
   *  - (필요하면) refreshToken (DB에 없어서 새로 만든 경우)
   */
  async validateRefreshToken(token: string) {
    try {
      // 1) refresh JWT 유효성 검증(만료/위조)
      const verified = await this.jwtService.verifyAsync<{ sub: number }>(
        token,
      );

      const userId = verified.sub;
      if (!userId)
        throw new UnauthorizedException('Refresh Token payload 오류');

      // 2) DB에서 userId row 조회
      const dbToken = await this.refreshTokenRepo.findOne({
        where: { userId, isRevoked: false },
        order: { id: 'DESC' as const }, // 여러 개면 최신꺼
      });

      // 3) userId row가 없으면 -> 재갱신(새 refresh 저장 + access 발급)
      if (!dbToken) {
        const newRefreshToken = await this.generateRefreshToken(userId);
        const accessToken = this.generateAccessToken(userId);
        return { accessToken, refreshToken: newRefreshToken };
      }

      // 4) DB에 row가 있으면: expireAt 체크 (DB기준)
      if (dbToken.expireAt <= new Date()) {
        // 만료됐으면 재갱신 처리(원하면 여기서 dbToken isRevoked=true도 가능)
        const newRefreshToken = await this.generateRefreshToken(userId);
        const accessToken = this.generateAccessToken(userId);
        return { accessToken, refreshToken: newRefreshToken };
      }

      // 5) 해시 비교 (✅ await 필수)
      const isSame = await bcrypt.compare(token, dbToken.hashedToken);
      if (!isSame)
        throw new UnauthorizedException('Refresh Token이 유효하지 않습니다.');

      // 6) 정상 케이스: accessToken만 재발급
      const accessToken = this.generateAccessToken(userId);
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Refresh Token이 유효하지 않습니다.');
    }
  }
}
