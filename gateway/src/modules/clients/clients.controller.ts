import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un cliente' })
  @ApiBody({ type: CreateClientDto })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos (ej. RNC duplicado)' })
  async create(@Body() body: CreateClientDto) {
    const result = await this.clientsService.create(body);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  async findAll() {
    const result = await this.clientsService.findAll();
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result.data;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiParam({ name: 'id', description: 'UUID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 400, description: 'ID no es un UUID válido' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.clientsService.findOne(id);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }
    return result.data;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiParam({ name: 'id', description: 'UUID del cliente' })
  @ApiBody({ type: UpdateClientDto })
  @ApiResponse({ status: 200, description: 'Cliente actualizado' })
  @ApiResponse({ status: 400, description: 'ID no es un UUID válido o datos inválidos' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateClientDto) {
    const result = await this.clientsService.update(id, body);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un cliente' })
  @ApiParam({ name: 'id', description: 'UUID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente eliminado' })
  @ApiResponse({ status: 400, description: 'ID no es un UUID válido' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.clientsService.remove(id);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
