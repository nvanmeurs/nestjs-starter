import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Tuppettle')
    .setDescription('API for managing Tuppettle')
    .setVersion('1.0.0')
    .addTag('tuppettle')
    .addBearerAuth()
    .build();

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  SwaggerModule.setup('', app, document);

  await app.listen(4000);
}
bootstrap();
