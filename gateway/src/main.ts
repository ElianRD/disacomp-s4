import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { environment } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('Disacomp Gateway API')
    .setDescription('The API description for Disacomp Microservices Gateway')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = environment.PORT || 3001;
  await app.listen(port);
  console.log(`Gateway escuchando en http://localhost:${port}`);
}
bootstrap();
