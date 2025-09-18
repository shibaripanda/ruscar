import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CarDocument = HydratedDocument<Car> & { _id: Types.ObjectId };

type Media = { file_id: string; type: 'photo' | 'video' };
type HistoryItem = { tId: number; text: string; date: number };
export type StatusCar = 'new' | 'open' | 'closeUnhappy' | 'closeHappy';

@Schema({ timestamps: true })
export class Car {

  @Prop({ required: true })
  ownerTid: number;

  @Prop()
  marka: string;

  @Prop({ default: 'AAA_0000' })
  order: string;

  @Prop()
  model: string;

  @Prop()
  age: string;

  @Prop()
  contact: string;

  @Prop()
  vin: string;

  @Prop()
  info: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop()
  dateForWork: Date;

  @Prop()
  media: Media[];

  @Prop({ default: 'new' })
  status: StatusCar;

  @Prop({ default: [] })
  dataHistoryLine: HistoryItem[];
}

export const CarSchema = SchemaFactory.createForClass(Car);

CarSchema.index({ ownerTid: 1, marka: 1 });
