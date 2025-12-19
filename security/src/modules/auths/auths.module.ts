import { Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Refreshtokens } from './entities/refreshToken.entity';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('TOKEN_SECRET_KEY') ?? 'secret-key',
          signOptions: {
            expiresIn: (config.get<string>('TOKEN_EXPIRES_TIME') ??
              '10m') as JwtSignOptions['expiresIn'],
            issuer: config.get<string>('TOKEN_ISSUER') ?? 'koreaIT',
          },
        };
      },
    }),
    TypeOrmModule.forFeature([Refreshtokens]),
  ],
  controllers: [AuthsController],
  providers: [AuthsService, JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthsModule {}
