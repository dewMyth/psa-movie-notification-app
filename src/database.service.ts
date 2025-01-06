import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './schemas/movie-schema';
import { Model } from 'mongoose';

@Injectable()
export class DatabaseService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  createMovie = async (movieData: Movie) => {
    const newMovie = {
      ...movieData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const finalizedNewMovie = new this.movieModel(newMovie);
    return finalizedNewMovie.save();
  };

  findAllMovies = async (): Promise<Movie[]> => {
    return this.movieModel.find().exec();
  };

  findMovieByTitle = async (title): Promise<Movie> => {
    return this.movieModel
      .findOne({
        title: title,
      })
      .exec();
  };
}
