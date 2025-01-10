import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Movie } from './schemas/movie-schema';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class EmailService {
  sendEmail = async (movieList: Movie[]) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: 'dewmyth.dev@gmail.com', // Use any gmail
        pass: 'qklm neni exwv lzgs', // Replace the app password created for your account
      },
    });

    // Construct the path to the HTML template file
    const templatePath = path.join(
      __dirname,
      'templates',
      'new-movies-notify-template.html',
    );

    console.log(templatePath);

    // Read the HTML template file
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    // Generate HTML for each movie
    const moviesHtml = movieList
      .map((movie) => {
        return `
      <div class="movie">
        <img src="${movie.image}" alt="${movie.title}">
        <div class="movie-details">
          <a href="${movie.link}" class="movie-title">${movie.title}</a>
          <p class="movie-category">Category: ${movie.category}</p>
        </div>
      </div>
    `;
      })
      .join('\n');

    // Replace placeholder(s) with actual data
    htmlTemplate = htmlTemplate.replace('[MOVIES]', moviesHtml);

    const timeNow = new Date().toISOString();

    // Constuct the email options
    const mailOptions = {
      from: `"PSA NOTIFICATION APP" <dewmyth.dev@gmail.com>`,
      to: 'akalankadewmith@gmail.com',
      subject: `${movieList.length} New movies added on ${timeNow}`,
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);

    return info.messageId
      ? 'Message sent: ' + info.messageId
      : 'Error Sending Message';
  };
}
