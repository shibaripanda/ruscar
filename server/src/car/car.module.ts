import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CarSchema } from './car.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Car', schema: CarSchema }])],
  controllers: [],
  exports: [CarService],
  providers: [CarService],
})
export class CarModule {}
