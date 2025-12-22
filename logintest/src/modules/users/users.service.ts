import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { nickname, password } = createUserDto;

    // 1) 닉네임 중복 체크
    const exists = await this.userRepo.exists({ where: { nickname } });
    if (exists) throw new ConflictException('이미 사용 중인 닉네임입니다.');

    // 2) 비밀번호 해시
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3) 저장
    const user = this.userRepo.create({
      nickname,
      hashedPassword,
    });

    const saved = await this.userRepo.save(user);

    // 4) 응답에서 hashedPassword 숨기기(보안)
    const { hashedPassword: _, ...result } = saved;
    return `${user.nickname} 생성되었습니다.`;
  }

  async findAll() {
    // 비밀번호는 절대 내려주지 않음
    return this.userRepo.find({
      select: ['id', 'nickname', 'hashedPassword'],
      order: { id: 'ASC' },
    });
  }

  async updatePassword(id: number, updateUserDto: UpdateUserDto) {
    const { password, newPassword } = updateUserDto as any;

    // ✅ 기존 비번/새 비번 둘 다 받는 게 정상 구조
    if (!password || !newPassword) {
      throw new BadRequestException(
        'password(기존)와 newPassword(변경)가 필요합니다.',
      );
    }

    const user = await this.userRepo.findOne({
      where: { id },
      select: ['id', 'hashedPassword'],
    });
    if (!user) throw new NotFoundException('아이디 확인이 필요합니다.');

    // ✅ bcrypt.compare(평문, 해시) 순서가 맞아야 함
    const isSame = await bcrypt.compare(password, user.hashedPassword);
    if (!isSame)
      throw new NotFoundException('기존 비밀번호가 일치하지 않습니다.');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepo.update(id, { hashedPassword });

    return '비밀번호가 수정되었습니다.';
  }

  async updateNickname(id: number, updateUserDto: UpdateUserDto) {
    const { nickname } = updateUserDto;
    if (!nickname) throw new NotFoundException('닉네임 확인이 필요합니다.');

    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('아이디 확인이 필요합니다.');

    await this.userRepo.update(id, {
      nickname,
    });

    return '닉네임이 수정되었습니다.';
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('해당 아이디는 존재하지 않습니다.');

    await this.userRepo.delete({ id });

    return `해당 id ${id}의 유저는 삭제되었습니다.`;
  }

  async me(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('해당 아이디는 존재하지 않습니다.');

    return { id: user.id, nickname: user.nickname };
  }
}
