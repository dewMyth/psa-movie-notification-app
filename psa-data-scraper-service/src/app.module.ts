import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { Movie, MovieSchema } from './schemas/movie-schema';

import { AppController } from './app.controller';

import { AppService } from './app.service';
import { ScraperService } from './scraper.service';
import { InitiatorService } from './initiator.service';
import { DatabaseService } from './database.service';
import { NotificationGateway } from './notification-gateway';
import { EmailService } from './email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available throughout the app
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ScraperService,
    InitiatorService,
    DatabaseService,
    EmailService,
    NotificationGateway,
  ],
})
export class AppModule {}
