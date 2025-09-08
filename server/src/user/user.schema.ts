import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

type Role = 'superadmin' | 'admin' | 'user';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  tId: number;

  @Prop()
  username: string;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop({ default: 'user' })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.index({ subscriptionExpiresAt: 1, status: 1 });
