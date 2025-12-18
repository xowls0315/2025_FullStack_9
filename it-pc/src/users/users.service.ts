import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { LoginUserDto } from '../auth/dto/login-user.dto';

type SafeUser = Omit<Users, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
  ) {}

  private toSafeUser(user: Users): SafeUser {
    // password 제거해서 리턴
    // eslint가 싫어하면 구조분해로 깔끔하게:
    const { password, ...safe } = user;
    // return safe;
    return user;
  }

  // ✅ 회원가입 (bcrypt hash 저장)
  async create(dto: CreateUserDto): Promise<SafeUser> {
    const exists = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('이미 존재하는 이메일입니다.');

    const hashed = await bcrypt.hash(dto.password, 10); // saltRounds=10

    const user = this.usersRepo.create({
      email: dto.email,
      password: hashed,
    });

    const saved = await this.usersRepo.save(user);
    return this.toSafeUser(saved);
  }

  // ✅ 전체 조회 (password 제외)
  async findAll(): Promise<SafeUser[]> {
    const users = await this.usersRepo.find();
    return users.map((u) => this.toSafeUser(u));
  }

  // ✅ 단일 조회 (password 제외)
  async findOne(id: number): Promise<SafeUser> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`${id}번 유저 없음`);
    return this.toSafeUser(user);
  }

  // ✅ 수정 (안 준 값 유지 + password 변경 시 재해시)
  async update(id: number, dto: UpdateUserDto): Promise<SafeUser> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`${id}번 유저 없음`);

    if (dto.email && dto.email !== user.email) {
      const exists = await this.usersRepo.findOne({
        where: { email: dto.email },
      });
      if (exists) throw new ConflictException('이미 존재하는 이메일입니다.');
      user.email = dto.email;
    }

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    const saved = await this.usersRepo.save(user);
    return this.toSafeUser(saved);
  }

  async remove(id: number): Promise<string> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`${id}번 유저 없음`);

    await this.usersRepo.delete(id);
    return `${id}번 유저 삭제 완료`;
  }

  // // ✅ AuthService에서 사용: 이메일로 유저 찾기(비번 포함 필요)
  // async findByEmail(email: string): Promise<Users | null> {
  //   return this.usersRepo.findOne({ where: { email } });
  // }

  // // ✅ AuthService에서 사용: 비번 검증
  // async validatePassword(user: Users, plain: string): Promise<boolean> {
  //   return bcrypt.compare(plain, user.password);
  // }
}
