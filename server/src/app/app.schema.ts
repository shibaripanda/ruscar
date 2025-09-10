import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppDocument = App & Document;

export type settings = 'settings';

@Schema({ timestamps: true })
export class App {
  @Prop({ required: true, unique: true })
  docName: settings;

  @Prop()
  placeholderImage: string;
}

export const AppSchema = SchemaFactory.createForClass(App);
