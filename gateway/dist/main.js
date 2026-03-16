"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Disacomp API')
        .setDescription('API Gateway — Sistema de Gestión de Clientes y Facturas')
        .setVersion('1.0')
        .addTag('clients', 'Gestión de clientes')
        .addTag('invoices', 'Gestión de facturas')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
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
//# sourceMappingURL=main.js.map