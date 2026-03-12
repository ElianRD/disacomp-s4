// Decorador personalizado para agrupar metadatos de la API de clientes
// Extensible para ApiTags, ApiResponse de Swagger, etc.
import { applyDecorators } from '@nestjs/common';

export function ClientApi() {
  return applyDecorators();
}
