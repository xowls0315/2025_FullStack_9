import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
  ) {}

  // ✅ 회원 등록 (bcrypt hash 저장)
  async create(dto: CreateUserDto): Promise<Users> {
    const exists = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('이미 존재하는 이메일입니다.');

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepo.create({
      email: dto.email,
      password: hashed,
    });

    return this.usersRepo.save(user);
  }

  // ✅ 전체 조회 (password 포함)
  async findAll(): Promise<Users[]> {
    return this.usersRepo.find({ order: { id: 'ASC' } });
  }

  // ✅ 단일 조회 (password 포함)
  async findOne(id: number): Promise<Users> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`${id}번 유저 없음`);
    return user;
  }

  // ✅ 회원 탈퇴
  async remove(id: number): Promise<string> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`${id}번 유저 없음`);

    await this.usersRepo.delete(id);
    return `${id}번 유저 삭제 완료`;
  }

  // ✅ (Auths용) 로그인 검증용 (password 포함 조회)
  async findByEmailWithPassword(email: string): Promise<Users | null> {
    return this.usersRepo.findOne({ where: { email } });
  }
}
