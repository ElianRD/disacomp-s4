import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class InvoicesService {
  constructor(@Inject('MAIN_SERVICE') private readonly client: ClientProxy) {}

  async create(data: any) {
    return firstValueFrom(this.client.send('invoice.create', data));
  }

  async findAll(clientId?: string) {
    return firstValueFrom(this.client.send('invoice.findAll', { clientId }));
  }

  async findOne(id: string) {
    return firstValueFrom(this.client.send('invoice.findOne', id));
  }

  async update(id: string, data: any) {
    return firstValueFrom(this.client.send('invoice.update', { id, data }));
  }

  async remove(id: string) {
    return firstValueFrom(this.client.send('invoice.delete', id));
  }

  async getSalesReport(startDate: string, endDate: string) {
    return firstValueFrom(
      this.client.send('invoice.salesReport', { startDate, endDate }),
    );
  }
}
