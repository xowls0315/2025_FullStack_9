import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';

import { RefreshToken } from './entities/refresh-token.entity';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { Users } from '../users/entities/user.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshRepo: Repository<RefreshToken>,

    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
  ) {}

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * refresh token 저장
   * - token(원문) -> hashedToken(sha256)
   * - expireAt은 예시로 7일
   */
  async create(dto: CreateRefreshTokenDto) {
    const { userId, token } = dto;

    // user 존재 확인(외래키 에러를 서비스 레벨에서 명확히 처리)
    const userExists = await this.userRepo.exists({ where: { id: userId } });
    if (!userExists) throw new NotFoundException('존재하지 않는 유저입니다.');

    const hashedToken = this.hashToken(token);

    const expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + 7); // 예: 7일 만료

    const entity = this.refreshRepo.create({
      userId,
      hashedToken,
      isRevoked: false,
      expireAt,
    });

    return this.refreshRepo.save(entity);
  }

  /**
   * 토큰 검증용 조회 (revoked 아니고, 만료 안 된 것)
   */
  async findValid(userId: number, token: string) {
    const hashedToken = this.hashToken(token);

    return this.refreshRepo.findOne({
      where: {
        userId,
        hashedToken,
        isRevoked: false,
      },
    });
  }

  /**
   * 로그아웃 등에서 폐기
   */
  async revokeById(id: number) {
    await this.refreshRepo.update({ id }, { isRevoked: true });
    return { id, revoked: true };
  }

  async revokeAllByUserId(userId: number) {
    await this.refreshRepo.update({ userId }, { isRevoked: true });
    return { userId, revokedAll: true };
  }
}
