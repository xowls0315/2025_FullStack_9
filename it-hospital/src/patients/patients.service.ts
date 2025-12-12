import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  private patients: Patient[] = [
    { id: 1, name: '박환자', injury: '왼쪽 팔 골절', severity: '중상' },
    { id: 2, name: '최환자', injury: '경미한 타박상', severity: '경상' },
  ];

  private nextId =
    this.patients.length > 0
      ? Math.max(...this.patients.map((p) => p.id)) + 1
      : 1;

  // CREATE
  create(createPatientDto: CreatePatientDto): Patient {
    const newPatient: Patient = {
      id: this.nextId++,
      name: createPatientDto.name,
      injury: createPatientDto.injury,
      severity: createPatientDto.severity,
    };

    this.patients.push(newPatient);
    return newPatient;
  }

  // READ ALL
  findAll(): Patient[] {
    return this.patients;
  }

  // READ ONE
  findOne(id: number): Patient {
    const patient = this.patients.find((p) => p.id === id);
    if (!patient) {
      throw new NotFoundException(`${id}번 환자를 찾을 수 없습니다.`);
    }
    return patient;
  }

  // UPDATE
  update(id: number, updatePatientDto: UpdatePatientDto): Patient {
    const patient = this.findOne(id);

    patient.name = updatePatientDto.name ?? patient.name;
    patient.injury = updatePatientDto.injury ?? patient.injury;
    patient.severity = updatePatientDto.severity ?? patient.severity;

    return patient;
  }

  // DELETE
  remove(id: number): string {
    const index = this.patients.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`${id}번 환자를 찾을 수 없습니다.`);
    }

    this.patients.splice(index, 1);
    return `${id}번 환자가 삭제되었습니다.`;
  }
}
