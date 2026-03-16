import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop Dell XPS 15', description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Laptop de alto rendimiento 16GB RAM, 512GB SSD', description: 'Descripción opcional' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1500.0, description: 'Precio del producto (no negativo)' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 10, description: 'Cantidad disponible en stock (no negativo)' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'DL-XPS15-001', description: 'Código único de producto (SKU)' })
  @IsString()
  @IsNotEmpty()
  sku: string;
}
