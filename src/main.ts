import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const frontEndAddress =
    configService.get<string>('FRONT_END_ADDRESS') || 'http://localhost:5173';

  app.setGlobalPrefix('api/v1.0');
  app.useGlobalPipes(new ZodValidationPipe());

  app.enableCors({
    origin: [frontEndAddress],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = configService.get<number>('API_PORT') || 3000;

  await app.listen(port);
}
void bootstrap();
