import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Refreshtoken } from './entities/refreshToken.entity';
import { Users } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';

@Injectable()
export class AuthsService {
  constructor(
    @InjectRepository(Refreshtoken)
    private refreshtokenRepository: Repository<Refreshtoken>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private tokenService: TokenService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = await this.tokenService.generateAccessToken(user.id);
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  async validateRefreshToken(token: string) {
    return this.tokenService.validRefreshToken(token);
  }
}
