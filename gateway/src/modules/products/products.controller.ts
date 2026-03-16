import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un producto' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos (ej. SKU duplicado)' })
  async create(@Body() body: CreateProductDto) {
    const result = await this.productsService.create(body);
    if (!result.success) throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos devuelta exitosamente' })
  async findAll() {
    const result = await this.productsService.findAll();
    if (!result.success) throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR);
    return result.data;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.productsService.findOne(id);
    if (!result.success) throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    return result.data;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateProductDto) {
    const result = await this.productsService.update(id, body);
    if (!result.success) throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    return result;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.productsService.remove(id);
    if (!result.success) throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    return result;
  }
}
