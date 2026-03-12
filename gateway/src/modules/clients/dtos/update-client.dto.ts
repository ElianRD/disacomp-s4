import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClientDto {
  @ApiPropertyOptional({ example: 'Empresa XYZ', description: 'Nuevo nombre del cliente' })
  nombre?: string;

  @ApiPropertyOptional({ example: '101234567', description: 'Nuevo RNC (9 u 11 dígitos)' })
  rnc?: string;

  @ApiPropertyOptional({ example: 'Av. 27 de Febrero, Santiago', description: 'Nueva dirección' })
  direccion?: string;

  @ApiPropertyOptional({ example: '809-555-9999', description: 'Nuevo teléfono' })
  telefono?: string;
}
