import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  app.useGlobalPipes(
    // whitelist: permite aceptar todos los datos; forbidNonWhitelisted: valida que los inputs sean del DTO
    new ValidationPipe({
      whitelist: true, // whitelist: previene datos maliciosos
      transform: true, // transform: convierte los payloads de entrada en los controladores en el DTO
      forbidNonWhitelisted: true, // forbidNonWhitelisted: valida que los inputs sean del DTO
      transformOptions: { enableImplicitConversion: true }, // enableImplicitConversion: Hábilitamos que los datos implícitos sean convertidos al tipo que es
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  );
  await app.listen(3000);
}
bootstrap();
