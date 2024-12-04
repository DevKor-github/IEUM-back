import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceModule } from './place/place.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { TagModule } from './tag/tag.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TripModule } from './trip/trip.module';
import { FolderModule } from './folder/folder.module';
import { CollectionModule } from './collection/collection.module';
import { S3Service } from './place/services/s3.service';
import { CrawlingModule } from './crawling/crawling.module';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ExporterService } from './exporter/exporter.service';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ExporterMiddleware } from './common/middleware/exporter.middleware';
import { WinstonLoggerMiddleware } from './common/middleware/winston.logger.middleware';
import { CollectionComplexModule } from './collection-complex/collection-complex.module';
import { PlaceComplexModule } from './place-complex/place-complex.module';
import { FolderComplexModule } from './folder-complex/folder-complex.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const nodeMode = process.env.NODE_ENV ?? 'local';
        //console.log(nodeMode);
        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database:
            nodeMode === 'production'
              ? process.env.DB_DATABASE_PROD
              : process.env.DB_DATABASE,
          // entities: [__dirname + '/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: true,
          logging: false,
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
    JwtModule.register({}),
    PlaceModule,
    TagModule,
    AuthModule,
    UserModule,
    TripModule,
    FolderModule,
    CollectionModule,
    CrawlingModule,
    CollectionComplexModule,
    PlaceComplexModule,
    FolderComplexModule,
  ],
  controllers: [AppController],
  providers: [AppService, S3Service, ExporterService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*')
      .apply(WinstonLoggerMiddleware)
      .forRoutes('*');
    consumer.apply(ExporterMiddleware).forRoutes('*');
  }
}
