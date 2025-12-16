import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CoffeeService {
  constructor(
    @InjectRepository(Coffee) private coffeeRepository: Repository<Coffee>,
  ) {}

  // CREATE
  async create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = await this.coffeeRepository.create(createCoffeeDto);
    const result = await this.coffeeRepository.save(coffee);
    return `${result.name}이(가) 등록 되었습니다!`;
  }

  // READ ALL
  findAll() {
    const coffees = this.coffeeRepository.find();
    return coffees;
  }

  // READ ONE
  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id },
    });

    if (!coffee) {
      throw new NotFoundException(`${id}번 커피를 찾을 수 없습니다.`);
    }

    return coffee;
  }

  // UPDATE (PATCH/PUT 공통: 안 준 값 유지)
  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const coffee = await this.findOne(id); // 없으면 여기서 404

    // "안 준 값은 유지" (nullish coalescing)
    coffee.name = updateCoffeeDto.name ?? coffee.name;
    coffee.price = updateCoffeeDto.price ?? coffee.price;
    coffee.shots = updateCoffeeDto.shots ?? coffee.shots;

    return this.coffeeRepository.save(coffee);
  }

  // DELETE
  async remove(id: number) {
    // 먼저 존재 확인 (없으면 404)
    await this.findOne(id);

    await this.coffeeRepository.delete(id);
    return `${id}번 커피가 삭제되었습니다.`;
  }
}
