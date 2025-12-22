import { Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entities/user.entity';
import { RefreshToken } from '../refresh-token/entities/refresh-token.entity';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, RefreshToken]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('TOKEN_SECRET_KEY'),
      }),
    }),
  ],
  controllers: [AuthsController],
  providers: [AuthsService, TokensService, JwtAuthGuard],
})
export class AuthsModule {}
