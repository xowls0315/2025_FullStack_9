import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entities/doctor.entity';

@Injectable()
export class DoctorsService {
  // 초기 더미 데이터
  private doctors: Doctor[] = [
    {
      id: 1,
      name: '이영철',
      major: '외과',
      career: ['서울대병원 5년', '부산의료원 3년'],
    },
    {
      id: 2,
      name: '손정우',
      major: '내과',
      career: ['삼성서울병원 7년'],
    },
  ];

  private nextId =
    this.doctors.length > 0
      ? Math.max(...this.doctors.map((d) => d.id)) + 1
      : 1;

  // CREATE
  create(createDoctorDto: CreateDoctorDto): Doctor {
    const newDoctor: Doctor = {
      id: this.nextId++,
      name: createDoctorDto.name,
      major: createDoctorDto.major,
      career: createDoctorDto.career,
    };

    this.doctors.push(newDoctor);
    return newDoctor;
  }

  // READ ALL
  findAll(): Doctor[] {
    return this.doctors;
  }

  // READ ONE
  findOne(id: number): Doctor {
    const doctor = this.doctors.find((d) => d.id === id);
    if (!doctor) {
      throw new NotFoundException(`${id}번 의사를 찾을 수 없습니다.`);
    }
    return doctor;
  }

  // UPDATE
  update(id: number, updateDoctorDto: UpdateDoctorDto): Doctor {
    const doctor = this.findOne(id);

    doctor.name = updateDoctorDto.name ?? doctor.name;
    doctor.major = updateDoctorDto.major ?? doctor.major;
    doctor.career = updateDoctorDto.career ?? doctor.career;

    return doctor;
  }

  // DELETE
  remove(id: number): string {
    const index = this.doctors.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new NotFoundException(`${id}번 의사를 찾을 수 없습니다.`);
    }

    this.doctors.splice(index, 1);
    return `${id}번 의사가 삭제되었습니다.`;
  }
}
