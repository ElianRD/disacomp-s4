import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Laptop Dell XPS 15', description: 'Nombre del producto' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Laptop de alto rendimiento 32GB RAM', description: 'Descripción actualizada' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 1450.0, description: 'Precio del producto (no negativo)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 15, description: 'Cantidad disponible en stock (no negativo)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;
}
