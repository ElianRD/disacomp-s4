import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, ValidateNested, IsArray, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvoiceItemDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del Producto (UUID)' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 2, description: 'Cantidad a facturar' })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ example: 'INV-2024-001', description: 'Número de factura' })
  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del Cliente (UUID)' })
  @IsUUID()
  clientId: string;

  @ApiPropertyOptional({ example: '2024-03-15T10:00:00Z', description: 'Fecha de emisión' })
  @IsOptional()
  date?: Date;

  @ApiProperty({ type: [CreateInvoiceItemDto], description: 'Detalle de los productos a facturar' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];

  @ApiPropertyOptional({ example: 'PENDING', description: 'Estado inicial de la factura', enum: ['PENDING', 'PAID', 'CANCELLED'] })
  @IsString()
  @IsOptional()
  status?: string;
}
