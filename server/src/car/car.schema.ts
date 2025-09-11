import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CarDocument = Car & Document;

type Media = { file_id: string; type: 'photo' | 'video' };

@Schema({ timestamps: true })
export class Car {
  @Prop({ required: true })
  ownerTid: number;

  @Prop()
  marka: string;

  @Prop()
  model: string;

  @Prop()
  age: string;

  @Prop()
  vin: string;

  @Prop()
  info: string;

  @Prop()
  media: Media[];
}

//['marka', 'model', 'age', 'vin', 'info', 'media']

export const CarSchema = SchemaFactory.createForClass(Car);

// UserSchema.index({ subscriptionExpiresAt: 1, status: 1 });
