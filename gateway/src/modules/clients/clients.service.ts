import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClientsService {
  constructor(@Inject('MAIN_SERVICE') private readonly client: ClientProxy) {}

  async create(data: any) {
    return firstValueFrom(this.client.send('create_client', data));
  }

  async findAll() {
    return firstValueFrom(this.client.send('find_all_clients', {}));
  }

  async findOne(id: string) {
    return firstValueFrom(this.client.send('find_client', { id }));
  }

  async update(id: string, data: any) {
    return firstValueFrom(this.client.send('update_client', { id, ...data }));
  }

  async remove(id: string) {
    return firstValueFrom(this.client.send('delete_client', { id }));
  }
}
