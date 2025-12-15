import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { Mentor } from './entities/mentor.entity';

@Injectable()
export class MentorService {
  private mentors: Mentor[] = [
    { id: 1, name: '김멘토', position: '신입' },
    { id: 2, name: '이멘토', position: '경력' },
  ];

  private nextId =
    this.mentors.length > 0
      ? Math.max(...this.mentors.map((m) => m.id)) + 1
      : 1;

  create(createMentorDto: CreateMentorDto): Mentor {
    const newMentor: Mentor = { id: this.nextId++, ...createMentorDto };
    this.mentors.push(newMentor);
    return newMentor;
  }

  findAll(): Mentor[] {
    return this.mentors;
  }

  findOne(id: number): Mentor {
    const mentor = this.mentors.find((m) => m.id === id);
    if (!mentor)
      throw new NotFoundException(`${id}번 mentor를 찾을 수 없습니다.`);
    return mentor;
  }

  update(id: number, dto: UpdateMentorDto): Mentor {
    const mentor = this.findOne(id);

    mentor.name = dto.name ?? mentor.name;
    mentor.position = dto.position ?? mentor.position;

    return mentor;
  }

  remove(id: number): string {
    const index = this.mentors.findIndex((m) => m.id === id);
    if (index === -1)
      throw new NotFoundException(`${id}번 mentor를 찾을 수 없습니다.`);
    this.mentors.splice(index, 1);
    return `${id}번 mentor가 삭제되었습니다.`;
  }
}
