import { Injectable } from '@nestjs/common';
import type { Response } from 'express';
import PDFDocument from 'pdfkit';

@Injectable()
export class PdfGeneratorService {
  async generateSalesReportPdf(
    report: any,
    startDate: string,
    endDate: string,
    res: Response,
  ): Promise<void> {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte-ventas-${startDate}-${endDate}.pdf`,
    );
    doc.pipe(res);

    // ────────────────────────────
    // PALETA DE COLORES
    const COLOR_PRIMARY = '#10365c';
    const COLOR_SECONDARY = '#34495E';
    const COLOR_TEXT = '#333333';
    const COLOR_LIGHT = '#ECF0F1';

    // ────────────────────────────
    // ENCABEZADO (Header)
    doc.fillColor(COLOR_PRIMARY).fontSize(28).font('Helvetica-Bold').text('DISACOMP', 50, 50);

    // Información de Contacto
    doc
      .fillColor(COLOR_SECONDARY)
      .fontSize(10)
      .font('Helvetica')
      .text('Av. Principal #123, Santo Domingo', 50, 80)
      .text('info@disacomp.com | 809-555-0000', 50, 95);

    // Título del Documento al lado derecho
    doc
      .fillColor(COLOR_PRIMARY)
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('REPORTE DE VENTAS', 300, 50, { align: 'right' });

    // Línea separadora superior
    doc.moveTo(50, 125).lineTo(545, 125).lineWidth(1.5).strokeColor(COLOR_PRIMARY).stroke();

    // ────────────────────────────
    // INFO DEL REPORTE Y PERIODO
    doc.moveDown(1.5);
    const topInfoY = doc.y;

    // Caja izquierda: periodo evaluado
    doc.rect(50, topInfoY, 235, 60).fillAndStroke(COLOR_LIGHT, COLOR_LIGHT);
    doc.fillColor(COLOR_SECONDARY).fontSize(10).font('Helvetica-Bold').text('PERÍODO EVALUADO', 60, topInfoY + 10);
    doc.fillColor(COLOR_TEXT).fontSize(11).font('Helvetica').text(`Desde: ${startDate}`, 60, topInfoY + 28);
    doc.text(`Hasta: ${endDate}`, 60, topInfoY + 43);

    // Caja derecha: detalles del informe
    doc.rect(310, topInfoY, 235, 60).fillAndStroke(COLOR_LIGHT, COLOR_LIGHT);
    doc.fillColor(COLOR_SECONDARY).fontSize(10).font('Helvetica-Bold').text('DETALLES DEL INFORME', 320, topInfoY + 10);
    doc.fillColor(COLOR_TEXT).fontSize(11).font('Helvetica').text(`Generado el: ${new Date().toLocaleDateString()}`, 320, topInfoY + 28);
    doc.text(`Total Facturas: ${report.totalInvoices}`, 320, topInfoY + 43);

    // ────────────────────────────
    // TOTAL DESTACADO
    doc.y = topInfoY + 80;
    const totalBoxY = doc.y;
    doc.rect(50, totalBoxY, 495, 40).fillAndStroke(COLOR_PRIMARY, COLOR_PRIMARY);
    doc.fillColor('white').fontSize(14).font('Helvetica-Bold').text('INGRESO TOTAL DEL PERÍODO:', 65, totalBoxY + 13);
    doc
      .fillColor('white')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text(
        `$${Number(report.totalSales).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        300,
        totalBoxY + 13,
        { align: 'right' },
      );

    // ────────────────────────────
    // TABLA DE FACTURAS
    doc.y = totalBoxY + 70;
    const tableTop = doc.y;

    // Encabezado de la tabla
    doc.rect(50, tableTop, 495, 25).fillAndStroke(COLOR_SECONDARY, COLOR_SECONDARY);
    doc.fillColor('white').fontSize(10).font('Helvetica-Bold');
    doc.text('#', 60, tableTop + 7, { width: 25 });
    doc.text('FACTURA', 90, tableTop + 7, { width: 90 });
    doc.text('FECHA', 180, tableTop + 7, { width: 80 });
    doc.text('CLIENTE', 260, tableTop + 7, { width: 130 });
    doc.text('ESTADO', 390, tableTop + 7, { width: 60 });
    doc.text('MONTO', 450, tableTop + 7, { width: 85, align: 'right' });

    // Contenido de la tabla
    let currentY = tableTop + 25;

    if (report.invoices && report.invoices.length > 0) {
      report.invoices.forEach((inv: any, index: number) => {
        // Salto de página
        if (currentY > 730) {
          doc.addPage();
          currentY = 50;
          doc.rect(50, currentY, 495, 25).fillAndStroke(COLOR_SECONDARY, COLOR_SECONDARY);
          doc.fillColor('white').fontSize(10).font('Helvetica-Bold');
          doc.text('#', 60, currentY + 7, { width: 25 });
          doc.text('FACTURA', 90, currentY + 7, { width: 90 });
          doc.text('FECHA', 180, currentY + 7, { width: 80 });
          doc.text('CLIENTE', 260, currentY + 7, { width: 130 });
          doc.text('ESTADO', 390, currentY + 7, { width: 60 });
          doc.text('MONTO', 450, currentY + 7, { width: 85, align: 'right' });
          currentY += 25;
        }

        const bgColor = index % 2 === 0 ? '#FFFFFF' : '#F9F9F9';
        doc.rect(50, currentY, 495, 25).fillAndStroke(bgColor, bgColor);

        doc.fillColor(COLOR_TEXT).fontSize(9).font('Helvetica');

        doc.text((index + 1).toString(), 60, currentY + 7, { width: 25 });
        doc.font('Helvetica-Bold').text(inv.invoiceNumber, 90, currentY + 7, { width: 90 });

        doc.font('Helvetica');
        const d = new Date(inv.date);
        const dateStr = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(
          d.getDate(),
        ).padStart(2, '0')}`;
        doc.text(dateStr, 180, currentY + 7, { width: 80 });

        const shortClientId = inv.clientId.split('-')[0] + '...';
        doc.text(shortClientId, 260, currentY + 7, { width: 130 });

        if (inv.status === 'PAID') {
          doc.fillColor('#27AE60');
        } else if (inv.status === 'CANCELLED') {
          doc.fillColor('#E74C3C');
        } else {
          doc.fillColor('#F39C12');
        }
        doc.font('Helvetica-Bold').text(inv.status, 390, currentY + 7, { width: 60 });

        doc
          .fillColor(COLOR_TEXT)
          .font('Helvetica')
          .text(
            `$${Number(inv.total).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            450,
            currentY + 7,
            { width: 85, align: 'right' },
          );

        doc.moveTo(50, currentY + 25).lineTo(545, currentY + 25).lineWidth(0.5).strokeColor('#E0E0E0').stroke();

        currentY += 25;
      });
    } else {
      doc.y = currentY + 20;
      doc
        .fillColor(COLOR_SECONDARY)
        .fontSize(12)
        .font('Helvetica-Oblique')
        .text('No se encontraron facturas en el período seleccionado.', { align: 'center' });
      currentY += 40;
    }

    doc.moveTo(50, currentY).lineTo(545, currentY).lineWidth(1.5).strokeColor(COLOR_SECONDARY).stroke();

    // ────────────────────────────
    // PIE DE PÁGINA (Última hoja)
    doc.y = 750;
    doc
      .fillColor('#95A5A6')
      .fontSize(8)
      .font('Helvetica')
      .text('Documento generado automáticamente por Disacomp System.', 50, 750, { align: 'center', lineBreak: false });

    doc.end();
  }
}
