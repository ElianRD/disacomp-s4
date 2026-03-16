import { ApiProperty } from '@nestjs/swagger';

export class InvoiceItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  subTotal: number;
}

export class InvoiceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  invoiceNumber: string;

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  total: number;

  @ApiProperty()
  status: string;

  @ApiProperty({ type: [InvoiceItemResponseDto] })
  items: InvoiceItemResponseDto[];
}
