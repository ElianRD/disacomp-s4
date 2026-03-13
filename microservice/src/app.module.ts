import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { environment } from './config/env.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: environment.DB_HOST,
      port: environment.DB_PORT,
      username: environment.DB_USER,
      password: environment.DB_PASSWORD,
      database: environment.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // Only for dev
    }),
    InvoicesModule,
  ],
})
export class AppModule {}
