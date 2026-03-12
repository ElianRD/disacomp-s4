import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateInvoiceUseCase } from './application/create-invoice.use-case';
import { FindAllInvoicesUseCase } from './application/find-all-invoices.use-case';
import { FindInvoiceUseCase } from './application/find-invoice.use-case';
import { UpdateInvoiceUseCase } from './application/update-invoice.use-case';
import { DeleteInvoiceUseCase } from './application/delete-invoice.use-case';
import { GetSalesReportUseCase } from './application/get-sales-report.use-case';
import { Invoice } from './domain/invoice.entity';

@Controller()
export class InvoicesController {
  constructor(
    private readonly createInvoiceUseCase: CreateInvoiceUseCase,
    private readonly findAllInvoicesUseCase: FindAllInvoicesUseCase,
    private readonly findInvoiceUseCase: FindInvoiceUseCase,
    private readonly updateInvoiceUseCase: UpdateInvoiceUseCase,
    private readonly deleteInvoiceUseCase: DeleteInvoiceUseCase,
    private readonly getSalesReportUseCase: GetSalesReportUseCase,
  ) {}

  @MessagePattern('invoice.create')
  async create(@Payload() data: any): Promise<Invoice> {
    return this.createInvoiceUseCase.execute(data);
  }

  @MessagePattern('invoice.findAll')
  async findAll(): Promise<Invoice[]> {
    return this.findAllInvoicesUseCase.execute();
  }

  @MessagePattern('invoice.findOne')
  async findOne(@Payload() id: number): Promise<Invoice> {
    return this.findInvoiceUseCase.execute(id);
  }

  @MessagePattern('invoice.update')
  async update(@Payload() payload: { id: number; data: any }): Promise<Invoice> {
    return this.updateInvoiceUseCase.execute(payload.id, payload.data);
  }

  @MessagePattern('invoice.delete')
  async delete(@Payload() id: number): Promise<void> {
    return this.deleteInvoiceUseCase.execute(id);
  }

  @MessagePattern('invoice.salesReport')
  async salesReport(@Payload() payload: { startDate: string; endDate: string }): Promise<any> {
    return this.getSalesReportUseCase.execute(
      new Date(payload.startDate),
      new Date(payload.endDate),
    );
  }
}
