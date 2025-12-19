import { Module } from '@nestjs/common';
import { GunsService } from './guns.service';
import { GunsController } from './guns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guns } from './entities/gun.entity';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthsModule } from '../auths/auths.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guns]),
    AuthsModule,
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
  ],
  controllers: [GunsController],
  providers: [GunsService],
  exports: [TypeOrmModule],
})
export class GunsModule {}
