import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';

@Injectable()
export class MemberService {
  members: Member[] = [
    {
      id: 1,
      name: '신여진',
      age: 29,
      registerDate: new Date('2025-12-12'),
      position: ['미드필더', '공격수'],
    },
  ];

  private nextId =
    this.members.length > 0
      ? Math.max(...this.members.map((m) => m.id)) + 1
      : 1;

  create(createMemberDto: CreateMemberDto): Member {
    const newMember: Member = {
      id: this.nextId++,
      registerDate: new Date(),
      name: createMemberDto.name,
      age: createMemberDto.age,
      position: createMemberDto.position,
    };

    this.members.push(newMember);
    return newMember; // 생성된 객체를 반환하는 게 보통 더 좋음
  }

  findAll(): Member[] {
    return this.members;
  }

  findOne(id: number): Member {
    const member = this.members.find((m) => m.id === id);
    if (!member)
      throw new NotFoundException(`${id}번 멤버를 찾을 수 없습니다.`);
    return member;
  }

  // PATCH: 일부만 수정 (안 준 값은 유지)
  update(id: number, updateMemberDto: UpdateMemberDto): Member {
    const member = this.findOne(id);

    member.name = updateMemberDto.name ?? member.name;
    member.age = updateMemberDto.age ?? member.age;
    member.position = updateMemberDto.position ?? member.position;

    return member;
  }

  remove(id: number): string {
    const index = this.members.findIndex((m) => m.id === id);
    if (index === -1)
      throw new NotFoundException(`${id}번 멤버를 찾을 수 없습니다.`);
    this.members.splice(index, 1);
    return `${id}번 멤버가 삭제되었습니다.`;
  }
}
