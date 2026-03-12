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
} from '@nestjs/common';
import type { Response } from 'express';
import PDFDocument from 'pdfkit';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  async create(@Body() body: any) {
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
  findAll() {
    return this.invoicesService.findAll();
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

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte-ventas-${startDate}-${endDate}.pdf`,
    );
    doc.pipe(res);

    // Encabezado
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('Reporte de Ventas', { align: 'center' });
    doc.moveDown(0.5);
    doc
      .fontSize(11)
      .font('Helvetica')
      .text(`Período: ${startDate}  →  ${endDate}`, { align: 'center' });
    doc.moveDown(1);

    // Resumen
    doc
      .fontSize(13)
      .font('Helvetica-Bold')
      .text('Resumen');
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.3);
    doc
      .fontSize(11)
      .font('Helvetica')
      .text(`Total de facturas: ${report.totalInvoices}`)
      .text(`Monto total: $${Number(report.totalSales).toFixed(2)}`);
    doc.moveDown(1);

    // Listado
    if (report.invoices && report.invoices.length > 0) {
      doc.fontSize(13).font('Helvetica-Bold').text('Detalle de facturas');
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.3);

      report.invoices.forEach((inv: any, index: number) => {
        doc
          .fontSize(10)
          .font('Helvetica')
          .text(
            `${index + 1}. #${inv.invoiceNumber}  |  Cliente ID: ${inv.clientId}  |  Fecha: ${new Date(inv.date).toLocaleDateString()}  |  $${Number(inv.total).toFixed(2)}  |  ${inv.status}`,
          );
      });
    } else {
      doc.fontSize(11).font('Helvetica').text('No hay facturas en este período.');
    }

    doc.end();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
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
  async update(@Param('id') id: string, @Body() body: any) {
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
  async remove(@Param('id') id: string) {
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
