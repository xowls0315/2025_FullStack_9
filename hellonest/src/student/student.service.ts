import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  // 메모리에 학생들을 저장할 배열
  private students: Student[] = [
    { id: 1, name: '이영철', age: 26 },
    { id: 2, name: '황태진', age: 25 },
    { id: 3, name: '손정우', age: 26 },
  ];
  // 초기 데이터 기반으로 nextId 자동 설정
  private nextId = Math.max(...this.students.map((v) => v.id)) + 1; // auto-increment 역할

  // CREATE: 학생 추가
  create(createStudentDto: CreateStudentDto): Student {
    const newStudent: Student = {
      id: this.nextId++,
      name: createStudentDto.name,
      age: createStudentDto.age,
    };

    this.students.push(newStudent);
    return newStudent;
  }

  // READ ALL: 전체 학생 리스트 조회
  findAll(): Student[] {
    return this.students;
  }

  // READ ONE: id로 한 명 조회
  findOne(id: number): Student {
    const student = this.students.find((v) => v.id === id);
    if (!student) {
      throw new NotFoundException(`${id}번의 학생은 존재하지 않습니다.`);
    }
    return student;
  }

  // UPDATE: id로 학생 정보 수정
  update(id: number, updateStudentDto: UpdateStudentDto): Student {
    const student = this.findOne(id); // 못 찾으면 여기서 NotFoundException

    if (updateStudentDto.name !== undefined) {
      student.name = updateStudentDto.name;
    }
    if (updateStudentDto.age !== undefined) {
      student.age = updateStudentDto.age;
    }

    return student;
  }

  // DELETE: id로 학생 삭제
  remove(id: number): string {
    const index = this.students.findIndex((v) => v.id === id);

    if (index === -1) {
      throw new NotFoundException(`${id}번의 학생은 존재하지 않습니다.`);
    }

    this.students.splice(index, 1);
    return `${id}번의 학생은 삭제되었습니다!`;
  }
}
