import type { Response } from 'express';
import { InvoicesService } from './invoices.service';
import { PdfGeneratorService } from './pdf-generator.service';
export declare class InvoicesController {
    private readonly invoicesService;
    private readonly pdfGeneratorService;
    constructor(invoicesService: InvoicesService, pdfGeneratorService: PdfGeneratorService);
    create(body: any): Promise<any>;
    findAll(): Promise<any>;
    getPdfReport(startDate: string, endDate: string, res: Response): Promise<void>;
    findOne(id: string): Promise<any>;
    update(id: string, body: any): Promise<any>;
    remove(id: string): Promise<void>;
}
