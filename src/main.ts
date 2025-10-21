import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3001);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Travel Assurance API') // Your API title
    .setDescription('API documentation') // Optional description
    .setVersion('1.0') // API version
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI available at http://localhost:3001/api

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //strips out properties that not in dto
      forbidNonWhitelisted: true, //throws error if extra properties sent
      transform: true, // transforms payload to DTO instances
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // your Next.js frontend
    ],
    credentials: true, // allow cookies/authorization headers
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Enable versioning via URI
  app.enableVersioning({
    type: VersioningType.URI, // will use /v1, /v2, etc.
    defaultVersion: '1', // default if not specified
  });
}
bootstrap();
