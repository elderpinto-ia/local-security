import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically remove non-whitelisted properties
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are provided
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Modern Backend API')
    .setDescription('API documentation for the modern backend application')
    .setVersion('1.0')
    .addTag('Auth', 'Authentication related endpoints')
    .addTag('Users', 'User management endpoints (Admin)')
    .addTag('Catalog', 'Catalog item management endpoints')
    .addTag('Details', 'Endpoints for retrieving detailed information (e.g., item details)')
    .addTag('Dashboard', 'Endpoints for dashboard summary data')
    // You can add more tags or security definitions (like Bearer Auth) here
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // UI available at /api-docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
