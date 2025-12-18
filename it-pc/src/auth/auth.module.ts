import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),

    // ✅ JwtService 제공자(Provider)를 AuthModule 컨텍스트에 등록
    JwtModule.register({}),
  ],

  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
