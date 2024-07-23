import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { json, urlencoded } from 'express';

declare const module: any;

async function bootstrap() {
  //여러 repository 아우르는 transaction 사용 위함.
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // whitelist: true, // DTO에 작성한 값만 수신
      // forbidNonWhitelisted: true, // DTO에 작성된 필수값이 수신되지 않을 경우 에러
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('IEUM API')
    .setDescription('IEUM APP TEST API')
    .setVersion('0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'Access Token',
        description: 'Enter JWT Access Token',
        in: 'header',
      },
      'Access Token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'Refresh Token',
        description: 'Enter JWT Refresh Token',
        in: 'header',
      },
      'Refresh Token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: ['http://localhost:3000', 'https://ieum.devkor.club'],
    credentials: true,
  });
  await app.listen(process.env.PORT);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
