import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClientsService {
  constructor(@Inject('MAIN_SERVICE') private readonly client: ClientProxy) {}

  async create(data: any) {
    return firstValueFrom(this.client.send('client.create', data));
  }

  async findAll() {
    return firstValueFrom(this.client.send('client.findAll', {}));
  }

  async findOne(id: string) {
    return firstValueFrom(this.client.send('client.findOne', id));
  }

  async update(id: string, data: any) {
    return firstValueFrom(this.client.send('client.update', { id, data }));
  }

  async remove(id: string) {
    return firstValueFrom(this.client.send('client.delete', id));
  }
}
