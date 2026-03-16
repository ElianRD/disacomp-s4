import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule as NestClientsModule, Transport } from '@nestjs/microservices';
import { environment } from '../../config/env.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    NestClientsModule.register([
      {
        name: 'MAIN_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [environment.RABBITMQ_URL],
          queue: environment.RABBITMQ_QUEUE,
          queueOptions: { durable: false },
        },
      },
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'disacomp_super_secret_key_2026',
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
