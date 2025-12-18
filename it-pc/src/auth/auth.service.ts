import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    const token = this.generateToken();
    return token;
  }

  async validateUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.usersRepo.findOne({
      where: { email: email },
    });
    if (!user) throw new NotFoundException('이메일을 확인해주세요!');
    const isSame = await bcrypt.compare(password, user.password);
    if (!isSame) throw new NotFoundException('비밀번호를 확인해주세요!');

    return user;
  }

  async generateToken() {
    return this.jwtService.sign(
      { name: 'arombake', main: 'mochi' },
      { expiresIn: '2m', secret: 'yum' },
    );
  }
}
