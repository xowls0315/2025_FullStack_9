import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}

  async create(createMemberDto: CreateMemberDto) {
    const member = await this.memberRepository.create(createMemberDto);
    const result = await this.memberRepository.save(member);
    return `${result.name}이(가) 등록 되었습니다!`;
  }

  findAll() {
    const members = this.memberRepository.find();
    return members;
  }

  async findOne(id: number) {
    const member = await this.memberRepository.findOne({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(`${id}번 멤버를 찾을 수 없습니다.`);
    }

    return member;
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    const member = await this.findOne(id); // 없으면 여기서 404

    // "안 준 값은 유지" (nullish coalescing)
    member.name = updateMemberDto.name ?? member.name;
    member.position = updateMemberDto.position ?? member.position;

    return this.memberRepository.save(member);
  }

  async remove(id: number) {
    // 먼저 존재 확인 (없으면 404)
    await this.findOne(id);

    await this.memberRepository.delete(id);
    return `${id}번 멤버가 삭제되었습니다.`;
  }
}
