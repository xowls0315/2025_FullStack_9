import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  private students: Student[] = [
    { id: 1, name: '황태진', age: 25, phone: '010-0315-1234' },
    { id: 2, name: '손정우', age: 26, phone: '010-9999-8888' },
  ];

  private nextId =
    this.students.length > 0
      ? Math.max(...this.students.map((s) => s.id)) + 1
      : 1;

  create(createStudentDto: CreateStudentDto): Student {
    const newStudent: Student = { id: this.nextId++, ...createStudentDto };
    this.students.push(newStudent);
    return newStudent;
  }

  findAll(): Student[] {
    return this.students;
  }

  findOne(id: number): Student {
    const student = this.students.find((s) => s.id === id);
    if (!student)
      throw new NotFoundException(`${id}번 student를 찾을 수 없습니다.`);
    return student;
  }

  update(id: number, dto: UpdateStudentDto): Student {
    const student = this.findOne(id);

    student.name = dto.name ?? student.name;
    student.age = dto.age ?? student.age;
    student.phone = dto.phone ?? student.phone;

    return student;
  }

  remove(id: number): string {
    const index = this.students.findIndex((s) => s.id === id);
    if (index === -1)
      throw new NotFoundException(`${id}번 student를 찾을 수 없습니다.`);
    this.students.splice(index, 1);
    return `${id}번 student가 삭제되었습니다.`;
  }
}
