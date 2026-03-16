import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SeedService {
  constructor(
    @Inject('MAIN_SERVICE') private readonly client: ClientProxy,
  ) {}

  async runSeed() {
    return firstValueFrom(this.client.send('run_seed', {}));
  }
}
