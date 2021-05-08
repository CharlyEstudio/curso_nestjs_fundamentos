import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    // whitelist: permite aceptar todos los datos; forbidNonWhitelisted: valida que los inputs sean del DTO
    new ValidationPipe({
      whitelist: true, // whitelist: previene datos maliciosos
      transform: true, // transform: convierte los payloads de entrada en los controladores en el DTO
      forbidNonWhitelisted: true, // forbidNonWhitelisted: valida que los inputs sean del DTO
    }),
  );
  await app.listen(3000);
}
bootstrap();
