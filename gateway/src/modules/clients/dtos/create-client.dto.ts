import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: 'Empresa ABC', description: 'Nombre del cliente' })
  nombre: string;

  @ApiProperty({ example: '101234567', description: 'RNC del cliente (9 u 11 dígitos)' })
  rnc: string;

  @ApiProperty({ example: 'Calle 1, Santo Domingo', description: 'Dirección del cliente' })
  direccion: string;

  @ApiProperty({ example: '809-555-1234', description: 'Teléfono del cliente' })
  telefono: string;
}
