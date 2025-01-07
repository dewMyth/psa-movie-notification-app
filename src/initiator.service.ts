import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ScraperService } from './scraper.service';
import { Movie } from './schemas/movie-schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationGateway } from './notification-gateway';

@Injectable()
export class InitiatorService {
  constructor(
    private _dbService: DatabaseService,
    private _scraperService: ScraperService,
    private _notificationGateway: NotificationGateway,
  ) {}

  @Cron(CronExpression.EVERY_2_HOURS)
  async startAdding(): Promise<any> {
    // Save new movies
    let newMovies: Movie[] = [];

    // Get the latest movies
    const lastAddedMoviesList: Movie[] =
      await this._scraperService.startScraping();

    if (lastAddedMoviesList.length == 0) {
      console.log('No Movies fetched!');
    }

    // Loop through each movie and check whether that movie exists in the db
    await Promise.all(
      lastAddedMoviesList.map(async (movie) => {
        const isMovieExist = await this._dbService.findMovieByTitle(
          movie.title,
        );

        // If not, add to the db
        if (!isMovieExist) {
          console.log(`New Movie Detected: ${movie.title}`);
          console.log(`Adding to db...: ${movie.title}`);
          await this._dbService.createMovie(movie);

          console.log(`Added movie to send in notifications: ${movie.title}`);
          newMovies.push(movie);
        } else {
          console.log(`Movie already existing: ${movie.title}`);
        }
      }),
    );

    console.log(
      `New movies to send in the notification => ${JSON.stringify(newMovies)}`,
    );

    this._notificationGateway.notifyJobCompletion(newMovies);

    return newMovies;
  }
}
