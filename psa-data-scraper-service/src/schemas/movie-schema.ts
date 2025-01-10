import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema()
export class Movie {
  @Prop()
  title: string;

  @Prop()
  link: string;

  @Prop({ required: false })
  image: string;

  @Prop({ required: false })
  category: string;

  @Prop()
  createdAt: string;

  @Prop({ required: false })
  updatedAt: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
