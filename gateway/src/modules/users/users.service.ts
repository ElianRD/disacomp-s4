import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(@Inject('MAIN_SERVICE') private readonly client: ClientProxy) {}

  async create(data: any) {
    return firstValueFrom(this.client.send('user.create', data));
  }

  async update(id: string, data: any) {
    return firstValueFrom(this.client.send('user.update', { id, data }));
  }

  async findAll() {
    return firstValueFrom(this.client.send('user.findAll', {}));
  }

  async delete(id: string) {
    return firstValueFrom(this.client.send('user.delete', id));
  }
}
