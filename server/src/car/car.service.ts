import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car, CarDocument } from './car.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CarService {
  constructor(
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    private readonly config: ConfigService,
  ) {
    console.log('CarService initialized');
  }

  async createCar(car: Car): Promise<CarDocument | null> {
    if (!car) return null;
    const created = new this.carModel(car);
    return created.save();
  }
}
