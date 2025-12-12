import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { Passenger } from './entities/passenger.entity';

@Injectable()
export class PassengersService {
  private passengers: Passenger[] = [
    { id: 1, name: 'Kim', passport: 'P1234567', membership: 'GOLD' },
    { id: 2, name: 'Lee', passport: 'P7654321', membership: 'BRONZE' },
  ];

  private nextId =
    this.passengers.length > 0
      ? Math.max(...this.passengers.map((v) => v.id)) + 1
      : 1;

  create(createPassengerDto: CreatePassengerDto): Passenger {
    const newPassenger: Passenger = {
      id: this.nextId++,
      ...createPassengerDto,
    };
    this.passengers.push(newPassenger);
    return newPassenger;
  }

  findAll(): Passenger[] {
    return this.passengers;
  }

  findOne(id: number): Passenger {
    const passenger = this.passengers.find((v) => v.id === id);
    if (!passenger) {
      throw new NotFoundException(`${id}번 승객을 찾을 수 없습니다.`);
    }
    return passenger;
  }

  update(id: number, updatePassengerDto: UpdatePassengerDto): Passenger {
    const passenger = this.findOne(id);

    passenger.name = updatePassengerDto.name ?? passenger.name;
    passenger.passport = updatePassengerDto.passport ?? passenger.passport;
    passenger.membership =
      updatePassengerDto.membership ?? passenger.membership;

    return passenger;
  }

  remove(id: number): string {
    const index = this.passengers.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new NotFoundException(`${id}번 승객을 찾을 수 없습니다.`);
    }
    this.passengers.splice(index, 1);
    return `${id}번 승객이 삭제되었습니다.`;
  }
}
