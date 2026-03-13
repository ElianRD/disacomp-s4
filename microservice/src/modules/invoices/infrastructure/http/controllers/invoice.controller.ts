import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateInvoiceUseCase } from '../../../application/use-cases/create-invoice.use-case';
import { ListInvoicesUseCase } from '../../../application/use-cases/list-invoices.use-case';
import { GetInvoiceUseCase } from '../../../application/use-cases/get-invoice.use-case';
import { UpdateInvoiceUseCase } from '../../../application/use-cases/update-invoice.use-case';
import { DeleteInvoiceUseCase } from '../../../application/use-cases/delete-invoice.use-case';
import { GetSalesReportUseCase } from '../../../application/use-cases/get-sales-report.use-case';
import { InvoicePresenter } from '../presenters/invoice.presenter';

@Controller()
export class InvoiceController {
  constructor(
    private readonly createInvoice: CreateInvoiceUseCase,
    private readonly listInvoices: ListInvoicesUseCase,
    private readonly getInvoice: GetInvoiceUseCase,
    private readonly updateInvoice: UpdateInvoiceUseCase,
    private readonly deleteInvoice: DeleteInvoiceUseCase,
    private readonly getSalesReport: GetSalesReportUseCase,
  ) {}

  @MessagePattern('invoice.create')
  async create(@Payload() data: any) {
    try {
      const result = await this.createInvoice.execute(data);
      return InvoicePresenter.present(result);
    } catch (error: any) {
      throw new RpcException({ message: error.message });
    }
  }

  @MessagePattern('invoice.findAll')
  async findAll() {
    try {
      const results = await this.listInvoices.execute();
      return InvoicePresenter.presentMany(results);
    } catch (error: any) {
      throw new RpcException({ message: error.message });
    }
  }

  @MessagePattern('invoice.findOne')
  async findOne(@Payload() id: string) {
    try {
      const result = await this.getInvoice.execute(id);
      return InvoicePresenter.present(result);
    } catch (error: any) {
      throw new RpcException({ message: error.message });
    }
  }

  @MessagePattern('invoice.update')
  async update(@Payload() payload: { id: string; data: any }) {
    try {
      const result = await this.updateInvoice.execute(payload.id, payload.data);
      return InvoicePresenter.present(result);
    } catch (error: any) {
      throw new RpcException({ message: error.message });
    }
  }

  @MessagePattern('invoice.delete')
  async delete(@Payload() id: string): Promise<void> {
    try {
      await this.deleteInvoice.execute(id);
    } catch (error: any) {
      throw new RpcException({ message: error.message });
    }
  }

  @MessagePattern('invoice.salesReport')
  async salesReport(@Payload() payload: { startDate: string; endDate: string }) {
    try {
      return await this.getSalesReport.execute(
        new Date(payload.startDate),
        new Date(payload.endDate),
      );
    } catch (error: any) {
      throw new RpcException({ message: error.message });
    }
  }
}
