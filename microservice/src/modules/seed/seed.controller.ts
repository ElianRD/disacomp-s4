import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SeedService } from './seed.service';

@Controller()
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @MessagePattern('run_seed')
  async executeSeed() {
    try {
      const result = await this.seedService.runSeed();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
