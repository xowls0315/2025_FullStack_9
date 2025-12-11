import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff } from './entities/staff.entity';

type StaffResponse = {
  id: number;
  name: string;
  position: '바리스타' | '슈퍼바이저' | '점장' | '부점장';
  startDate: string; // YYYY-MM-DD
};

@Injectable()
export class StaffsService {
  // 메모리에 staff들을 저장할 배열 (startDate는 Date 타입)
  private staffs: Staff[] = [
    { id: 1, name: 'J', position: '점장', startDate: new Date('2015-01-01') },
    {
      id: 2,
      name: '여진쓰',
      position: '부점장',
      startDate: new Date('2017-05-01'),
    },
    {
      id: 3,
      name: '율쓰',
      position: '슈퍼바이저',
      startDate: new Date('2020-04-01'),
    },
  ];

  //  초기 데이터가 있을 수도 / 없을 수도 있으니 안전하게 설정
  private nextId =
    this.staffs.length > 0 ? Math.max(...this.staffs.map((v) => v.id)) + 1 : 1;

  // 📌 Date → 'YYYY-MM-DD' 로 바꾸는 헬퍼 함수
  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 0~11 이라 +1
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // 📌 Staff(Entity) → StaffResponse 로 바꾸는 헬퍼
  private toResponse(staff: Staff): StaffResponse {
    return {
      id: staff.id,
      name: staff.name,
      position: staff.position,
      startDate: this.formatDate(staff.startDate),
    };
  }

  // CREATE: staff 추가
  create(createStaffDto: CreateStaffDto): StaffResponse {
    const newStaff: Staff = {
      id: this.nextId++,
      name: createStaffDto.name,
      position: createStaffDto.position,
      // DTO에서는 string을 받지만, 내부에서는 Date로 변환해서 저장
      startDate: new Date(createStaffDto.startDate),
    };

    this.staffs.push(newStaff);
    return this.toResponse(newStaff);
  }

  // READ ALL: 전체 staff 리스트 조회
  findAll(): StaffResponse[] {
    return this.staffs.map((s) => this.toResponse(s));
  }

  // READ ONE: id로 staff 한 개 조회
  findOne(id: number): StaffResponse {
    const staff = this.staffs.find((v) => v.id === id);
    if (!staff) {
      throw new NotFoundException(`${id}번의 스태프는 존재하지 않습니다.`);
    }
    return this.toResponse(staff);
  }

  // UPDATE: id로 staff 정보 수정
  update(id: number, updateStaffDto: UpdateStaffDto): StaffResponse {
    const staff = this.staffs.find((v) => v.id === id);
    if (!staff) {
      throw new NotFoundException(`${id}번의 스태프는 존재하지 않습니다.`);
    }

    if (updateStaffDto.name !== undefined) {
      staff.name = updateStaffDto.name;
    }
    if (updateStaffDto.position !== undefined) {
      staff.position = updateStaffDto.position;
    }
    if (updateStaffDto.startDate !== undefined) {
      staff.startDate = new Date(updateStaffDto.startDate);
    }

    return this.toResponse(staff);
  }

  // DELETE: id로 staff 삭제
  remove(id: number): string {
    const index = this.staffs.findIndex((v) => v.id === id);

    if (index === -1) {
      throw new NotFoundException(`${id}번의 스태프는 존재하지 않습니다.`);
    }

    this.staffs.splice(index, 1);
    return `${id}번의 스태프가 삭제되었습니다!`;
  }
}
