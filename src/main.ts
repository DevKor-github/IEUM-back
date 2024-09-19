import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { json, urlencoded } from 'express';
import { IeumExceptionFilter } from './common/filters/ieum-exception.filter';
import { UndefinedExceptionFilter } from './common/filters/undefined-exception.filter';
import { winstonLogger } from './common/logger/winston.logger';

declare const module: any;

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: winstonLogger,
  });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // whitelist: true, // DTO에 작성한 값만 수신
      // forbidNonWhitelisted: true, // DTO에 작성된 필수값이 수신되지 않을 경우 에러
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(
    new UndefinedExceptionFilter(),
    new IeumExceptionFilter(),
  );
  const config = new DocumentBuilder()
    .setTitle('IEUM API')
    .setDescription('IEUM APP TEST API')
    .setVersion('0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'access-token',
        description: 'AccessToken',
        in: 'header',
      },
      'access-token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'refresh-token',
        description: 'RefresToken',
        in: 'header',
      },
      'refresh-token',
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
