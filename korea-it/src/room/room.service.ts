import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
  private rooms: Room[] = [
    { id: 1, name: 'A', capacity: 30 },
    { id: 2, name: 'B', capacity: 20 },
  ];

  private nextId =
    this.rooms.length > 0 ? Math.max(...this.rooms.map((r) => r.id)) + 1 : 1;

  create(createRoomDto: CreateRoomDto): Room {
    const newRoom: Room = { id: this.nextId++, ...createRoomDto };
    this.rooms.push(newRoom);
    return newRoom;
  }

  findAll(): Room[] {
    return this.rooms;
  }

  findOne(id: number): Room {
    const room = this.rooms.find((r) => r.id === id);
    if (!room) throw new NotFoundException(`${id}번 room을 찾을 수 없습니다.`);
    return room;
  }

  update(id: number, dto: UpdateRoomDto): Room {
    const room = this.findOne(id);

    room.name = dto.name ?? room.name;
    room.capacity = dto.capacity ?? room.capacity;

    return room;
  }

  remove(id: number): string {
    const index = this.rooms.findIndex((r) => r.id === id);
    if (index === -1)
      throw new NotFoundException(`${id}번 room을 찾을 수 없습니다.`);
    this.rooms.splice(index, 1);
    return `${id}번 room이 삭제되었습니다.`;
  }
}
