import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeacherService {
  // 메모리에 선생들을 저장할 배열
  private teachers: Teacher[] = [
    {
      id: 1,
      name: '권지은',
      nickname: '담임',
      age: 34,
      subjects: ['국어', '기술가정'],
    },
    {
      id: 2,
      name: '이희국',
      nickname: '희탕이',
      age: 45,
      subjects: ['기하와 벡터', '확률과 통계'],
    },
  ];
  // 초기 데이터 기반으로 nextId 자동 설정
  private nextId = Math.max(...this.teachers.map((v) => v.id)) + 1; // auto-increment 역할

  // CREATE: Teacher 추가
  create(createTeacherDto: CreateTeacherDto): Teacher {
    const newTeacher: Teacher = {
      id: this.nextId++,
      name: createTeacherDto.name,
      nickname: createTeacherDto.nickname,
      age: createTeacherDto.age,
      subjects: createTeacherDto.subjects,
    };

    this.teachers.push(newTeacher);
    return newTeacher;
  }

  // READ ALL: 전체 Teacher 리스트 조회
  findAll(): Teacher[] {
    return this.teachers;
  }

  // READ ONE: id로 한 명 조회
  findOne(id: number): Teacher {
    const teacher = this.teachers.find((v) => v.id === id);
    if (!teacher) {
      throw new NotFoundException(`${id}번의 선생은 존재하지 않습니다.`);
    }
    return teacher;
  }

  // UPDATE: id로 Teacher 정보 수정
  update(id: number, updateTeacherDto: UpdateTeacherDto): Teacher {
    const teacher = this.findOne(id); // 못 찾으면 여기서 NotFoundException

    if (updateTeacherDto.name !== undefined) {
      teacher.name = updateTeacherDto.name;
    }
    if (updateTeacherDto.nickname !== undefined) {
      teacher.nickname = updateTeacherDto.nickname;
    }
    if (updateTeacherDto.age !== undefined) {
      teacher.age = updateTeacherDto.age;
    }
    if (updateTeacherDto.subjects !== undefined) {
      teacher.subjects = updateTeacherDto.subjects;
    }

    return teacher;
  }

  // DELETE: id로 Teacher 삭제
  remove(id: number): string {
    const index = this.teachers.findIndex((v) => v.id === id);

    if (index === -1) {
      throw new NotFoundException(`${id}번의 선생은 존재하지 않습니다.`);
    }

    this.teachers.splice(index, 1);
    return `${id}번의 선생은 삭제되었습니다!`;
  }
}
