import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAirplaneDto } from './dto/create-airplane.dto';
import {
  UpdateAirplaneDto,
  UpdateFlightScheduleDto,
} from './dto/update-airplane.dto';
import { Airplane, FlightSchedule } from './entities/airplane.entity';

@Injectable()
export class AirplanesService {
  private airplanes: Airplane[] = [
    {
      id: 1,
      name: 'IT-AIR-101',
      capacity: 180,
      schedules: [
        {
          departure: 'ICN',
          arrival: 'NRT',
          departureDate: '2025-12-11',
          departureTime: '09:00',
        },
      ],
    },
  ];

  private nextId =
    this.airplanes.length > 0
      ? Math.max(...this.airplanes.map((v) => v.id)) + 1
      : 1;

  create(createAirplaneDto: CreateAirplaneDto): Airplane {
    const newAirplane: Airplane = {
      id: this.nextId++,
      name: createAirplaneDto.name,
      capacity: createAirplaneDto.capacity,
      schedules: createAirplaneDto.schedules ?? [],
    };
    this.airplanes.push(newAirplane);
    return newAirplane;
  }

  findAll(): Airplane[] {
    return this.airplanes;
  }

  findOne(id: number): Airplane {
    const airplane = this.airplanes.find((v) => v.id === id);
    if (!airplane) {
      throw new NotFoundException(`${id}번 비행기를 찾을 수 없습니다.`);
    }
    return airplane;
  }

  update(id: number, updateAirplaneDto: UpdateAirplaneDto): Airplane {
    const airplane = this.findOne(id);

    // 기본 필드들은 ?? 로 처리
    airplane.name = updateAirplaneDto.name ?? airplane.name;
    airplane.capacity = updateAirplaneDto.capacity ?? airplane.capacity;

    // schedules가 넘어온 경우에만 처리
    if (updateAirplaneDto.schedules) {
      const updatedSchedules: FlightSchedule[] =
        updateAirplaneDto.schedules.map(
          (schedDto: UpdateFlightScheduleDto, idx) => {
            const prev = airplane.schedules[idx] ?? ({} as FlightSchedule);

            return {
              departure: schedDto.departure ?? prev.departure,
              arrival: schedDto.arrival ?? prev.arrival,
              departureDate: schedDto.departureDate ?? prev.departureDate,
              departureTime: schedDto.departureTime ?? prev.departureTime,
            };
          },
        );

      airplane.schedules = updatedSchedules;
    }

    return airplane;
  }

  remove(id: number): string {
    const index = this.airplanes.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new NotFoundException(`${id}번 비행기를 찾을 수 없습니다.`);
    }
    this.airplanes.splice(index, 1);
    return `${id}번 비행기가 삭제되었습니다.`;
  }
}
