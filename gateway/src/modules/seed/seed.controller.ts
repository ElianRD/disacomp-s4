import { Controller, Post, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Llenar la base de datos con información de prueba (vacía todo antes)' })
  @ApiResponse({ status: 201, description: 'Base de datos poblada exitosamente' })
  async executeSeed() {
    return this.seedService.runSeed();
  }
}
