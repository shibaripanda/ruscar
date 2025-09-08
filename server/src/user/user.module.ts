import { Module } from '@nestjs/common';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UserService],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
