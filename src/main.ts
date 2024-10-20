import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api', {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  const config = new DocumentBuilder()
    .setTitle('Alert MFB Assessment API Documentation')
    .setDescription(
      'API endpoints for the alert mfb backend developer assessment',
    )
    .setVersion('1.0')
    .addServer(process.env.API_URL, 'Server')
    // .addTag('Alert MFB Assessment API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(port);
}
bootstrap();
