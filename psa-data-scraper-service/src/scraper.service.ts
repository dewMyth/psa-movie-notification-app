import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PSAdata } from './types/psa-data.type';
import * as cheerio from 'cheerio';
import { Movie } from './schemas/movie-schema';
import { title } from 'process';

@Injectable()
export class ScraperService {
  startScraping = async (): Promise<Movie[]> => {
    let movies: Movie[];
    console.time('Time Taken to Scrape:');
    const response: PSAdata = await this.fetchPsaData();

    if (response?.message == 'Success!') {
      movies = await this.scrapeTheData(response.data);
    }

    console.timeEnd('Time Taken to Scrape:');
    return movies;
  };

  // Get the data as HTML from the website
  fetchPsaData = async (): Promise<PSAdata> => {
    const psaHtml = await axios
      .get('https://www.psa.wf')
      .catch((err) => console.log(err));

    if (!psaHtml) {
      return {
        data: null,
        message: 'Error when fetching data from PSArips',
      };
    }

    return {
      data: psaHtml.data,
      message: 'Success!',
    };
  };

  scrapeTheData = async (htmlDataAsString): Promise<Movie[]> => {
    let scrapedMovies: Movie[] = [];
    const $ = cheerio.load(htmlDataAsString);

    await Promise.all(
      // Get the movie from feature - Slider
      $('.featured .post').each((index, element) => {
        const featuredMediatitle = $(element)
          .find('.post-inner .post-title a')
          .text()
          .trim();

        const featuredMediaLink = $(element)
          .find('.post-inner .post-title a')
          .attr('href');

        const featuredMediaImage = $(element)
          .find('.post-inner .post-thumbnail a img')
          .attr('src');

        const featuredMediaCategory = $(element)
          .find('.post-inner .post-meta .post-category a')
          .eq(2)
          .text();

        if (featuredMediatitle && featuredMediaLink) {
          scrapedMovies?.push({
            title: featuredMediatitle,
            link: featuredMediaLink,
            image: featuredMediaImage,
            category: featuredMediaCategory,
            createdAt: new Date().toISOString(),
            updatedAt: '',
          });
        }
      }),
    );

    await Promise.all(
      // Get the movies from GRID - Rest of the movie data in the home page
      $('#grid-wrapper .post-row .post').each((index, element) => {
        const title = $(element)
          .find('.grid-item .post-inner .post-title a')
          .text()
          .trim();

        const link = $(element)
          .find('.grid-item .post-inner .post-title a')
          .attr('href');

        const image = $(element)
          .find('.grid-item .post-inner .post-thumbnail a img')
          .attr('src');

        const category = $(element)
          .find('.grid-item .post-inner .post-meta .post-category a')
          .last()
          .text();

        if (title && link) {
          scrapedMovies?.push({
            title: title,
            link: link,
            image: image,
            category: category,
            createdAt: new Date().toISOString(),
            updatedAt: '',
          });
        }
      }),
    );

    return scrapedMovies;
  };
}
