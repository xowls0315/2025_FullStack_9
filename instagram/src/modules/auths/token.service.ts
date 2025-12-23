import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Refreshtoken } from './entities/refreshToken.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Refreshtoken)
    private refreshtokenRepository: Repository<Refreshtoken>,
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(userId: number) {
    const payload = { userId };
    return this.jwtService.sign(payload, { expiresIn: '3m' });
  }

  async generateRefreshToken(userId: number) {
    const tokens = await this.refreshtokenRepository.find({
      where: { id: userId },
    });
    if (tokens) {
      const revokedTokens = tokens.map((v) => ({ ...v, isRevoked: false }));
      await this.refreshtokenRepository.save(revokedTokens);
    }
    const newRreshToken = this.jwtService.sign({ userId }, { expiresIn: '6m' });
    const hashedToken = await bcrypt.hash(newRreshToken, 10);
    const newToken = await this.refreshtokenRepository.create({
      hashtoken: hashedToken,
      userId,
      expiresAt: new Date(Date.now() + 6 * 60 * 1000),
    });
    await this.refreshtokenRepository.save(newToken);
    return newRreshToken;
  }

  async validRefreshToken(token: string) {
    try {
      await this.jwtService.verifyAsync(token);
      const payload = this.jwtService.decode(token);
      const dbToken = await this.refreshtokenRepository.findOne({
        where: { userId: payload.sub },
      });
      if (!dbToken) throw new UnauthorizedException('refresh token is invalid');
      const isSame = await bcrypt.compare(token, dbToken?.hashtoken ?? '');
      if (!isSame) throw new UnauthorizedException('refresh token is invalid');
      if (dbToken.isRevoked)
        throw new UnauthorizedException('refresh token is invalid');
      if (dbToken.expiresAt < new Date())
        throw new UnauthorizedException('refresh token is expired');
      return await this.generateAccessToken(payload);
    } catch (e) {
      throw new UnauthorizedException('refresh token is invalid');
    }
  }
}
