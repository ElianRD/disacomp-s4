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

  // Habilitar CORS para permitir peticiones desde el Frontend de Vue
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Gateway corriendo en: http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api/docs`);
}
bootstrap();
