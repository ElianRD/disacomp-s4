import { Module } from '@nestjs/common';
import { ClientsModule } from './modules/clients/clients.module';

@Module({
  imports: [ClientsModule],
})
export class AppModule {}
