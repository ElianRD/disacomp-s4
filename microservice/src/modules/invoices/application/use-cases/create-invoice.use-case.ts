import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import type { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { INVOICE_REPOSITORY } from '../../domain/repositories/invoice.repository.interface';
import type { IInvoiceEventPublisher } from '../ports/output/invoice-event-publisher.port';
import { INVOICE_EVENT_PUBLISHER } from '../ports/output/invoice-event-publisher.port';
import type { IProductRepository } from '../../../products/domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../../products/domain/repositories/product.repository.interface';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { InvoiceResponseDto } from '../dtos/invoice-response.dto';
import { InvoiceApplicationMapper } from '../mappers/invoice-application.mapper';
import { InvoiceAlreadyExistsException } from '../../domain/exceptions/invoice-already-exists.exception';
import { Invoice } from '../../domain/entities/invoice.entity';
import { InvoiceItem } from '../../domain/entities/invoice-item.entity';
import { ProductId } from '../../../products/domain/value-objects/product-id.vo';
import { ProductNotFoundException } from '../../../products/domain/exceptions/product.exceptions';

@Injectable()
export class CreateInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: IInvoiceRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(INVOICE_EVENT_PUBLISHER)
    private readonly eventPublisher: IInvoiceEventPublisher,
  ) {}

  async execute(dto: CreateInvoiceDto): Promise<InvoiceResponseDto> {
    const existing = await this.invoiceRepository.findByInvoiceNumber(dto.invoiceNumber);
    if (existing) {
      throw new InvoiceAlreadyExistsException(dto.invoiceNumber);
    }

    const invoiceId = uuidv4();
    const items: InvoiceItem[] = [];

    // Validar productos e inyectar sus valores reales
    if (dto.items && dto.items.length > 0) {
      for (const itemDto of dto.items) {
        const product = await this.productRepository.findById(new ProductId(itemDto.productId));
        if (!product) {
          throw new ProductNotFoundException(itemDto.productId);
        }

        const unitPrice = product.price.getValue();
        items.push(InvoiceItem.create({
          id: uuidv4(),
          invoiceId: invoiceId,
          productId: product.id.getValue(),
          quantity: itemDto.quantity,
          unitPrice: unitPrice,
          subTotal: unitPrice * itemDto.quantity
        }));
      }
    }

    const invoiceDate = dto.date ? new Date(dto.date) : new Date();

    const invoice = Invoice.create({
      id: invoiceId,
      invoiceNumber: dto.invoiceNumber,
      clientId: dto.clientId,
      date: invoiceDate,
      status: dto.status || 'PENDING',
      items: items // Total y tax calculados internamente por el create
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    for (const event of savedInvoice.domainEvents) {
      await this.eventPublisher.publish(event);
    }

    return InvoiceApplicationMapper.toResponse(savedInvoice);
  }
}
