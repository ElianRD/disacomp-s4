import type { Response } from 'express';
import { InvoicesService } from './invoices.service';
import { PdfGeneratorService } from './pdf-generator.service';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
export declare class InvoicesController {
    private readonly invoicesService;
    private readonly pdfGeneratorService;
    constructor(invoicesService: InvoicesService, pdfGeneratorService: PdfGeneratorService);
    create(body: CreateInvoiceDto): Promise<any>;
    findAll(user: any): Promise<any>;
    getPdfReport(startDate: string, endDate: string, res: Response): Promise<void>;
    findOne(id: string): Promise<any>;
    update(id: string, body: any): Promise<any>;
    remove(id: string): Promise<void>;
}
