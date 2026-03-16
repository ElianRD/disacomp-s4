import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Res,
  NotFoundException,
  BadRequestException,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';
import { InvoicesService } from './invoices.service';
import { PdfGeneratorService } from './pdf-generator.service';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly pdfGeneratorService: PdfGeneratorService,
  ) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Crear una nueva factura' })
  @ApiResponse({ status: 201, description: 'La factura ha sido creada satisfactoriamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  async create(@Body() body: CreateInvoiceDto) {
    try {
      return await this.invoicesService.create(body);
    } catch (error: any) {
      if (error.message?.includes('ya existe')) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las facturas' })
  @ApiResponse({ status: 200, description: 'Lista de facturas retornada exitosamente.' })
  findAll(@CurrentUser() user: any) {
    const clientId = user.role === 'CLIENT' ? user.clientId : undefined;
    return this.invoicesService.findAll(clientId);
  }

  // ⚠️ IMPORTANTE: Este endpoint debe ir ANTES de :id para que /report/pdf no sea
  // interpretado como un parámetro id
  @Get('report/pdf')
  async getPdfReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const report = await this.invoicesService.getSalesReport(startDate, endDate);
    await this.pdfGeneratorService.generateSalesReportPdf(report, startDate, endDate, res);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una factura por su ID' })
  @ApiResponse({ status: 200, description: 'Factura retornada exitosamente.' })
  @ApiResponse({ status: 400, description: 'El ID no es un UUID válido.' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.invoicesService.findOne(id);
    } catch (error: any) {
      if (error.message?.includes('no encontrada')) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Actualizar una factura existente' })
  @ApiResponse({ status: 200, description: 'La factura ha sido actualizada exitosamente.' })
  @ApiResponse({ status: 400, description: 'El ID no es un UUID válido.' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada.' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    try {
      return await this.invoicesService.update(id, body);
    } catch (error: any) {
      if (error.message?.includes('no encontrada')) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Eliminar una factura' })
  @ApiResponse({ status: 200, description: 'La factura ha sido eliminada exitosamente.' })
  @ApiResponse({ status: 400, description: 'El ID no es un UUID válido.' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.invoicesService.remove(id);
    } catch (error: any) {
      if (error.message?.includes('no encontrada')) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
