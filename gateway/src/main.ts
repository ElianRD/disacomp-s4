import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Disacomp API')
    .setDescription('API Gateway — Sistema de Gestión de Clientes y Facturas')
    .setVersion('1.0')
    .addTag('clients', 'Gestión de clientes')
    .addTag('invoices', 'Gestión de facturas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Gateway corriendo en: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger UI: http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
bootstrap();
