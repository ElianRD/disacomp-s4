import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class InvoiceEventConsumer {
  // Aquí se pueden agregar @EventPattern para escuchar eventos externos
  // Ejemplo: @EventPattern('client.deleted') para cancelar facturas del cliente
}
