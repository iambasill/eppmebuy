import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import appConfig from './config/app.config.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { TicketModule } from './modules/ticket/ticket.module.js';
import { UploadModule } from './modules/upload/upload.module.js';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import * as entities from './entities/index.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'postgres'>('app.database.type'),
        url: configService.get<string>('app.database.url'),
        host: configService.get<string>('app.database.host'),
        port: configService.get<number>('app.database.port'),
        username: configService.get<string>('app.database.username'),
        password: configService.get<string>('app.database.password'),
        database: configService.get<string>('app.database.name'),
        entities: entities.ENTITIES,
        synchronize: configService.get<string>('app.nodeEnv') !== 'production', // Auto-schema sync (disable in prod)
        logging: configService.get<string>('app.nodeEnv') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TicketModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule { }
