import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await this.usersRepository.save({ ...user, password: hashedPassword });
    return { message: 'User created successfully' };
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, newPassword } = updatePasswordDto;
    if (!(await bcrypt.compare(user.password, password ?? ''))) {
      throw new UnauthorizedException('현재 비밀번호가 다릅니다.');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.save({ ...user, password: hashedPassword });
    return { message: 'Password updated successfully' };
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.delete(id);
    return { message: 'User deleted successfully' };
  }
}
