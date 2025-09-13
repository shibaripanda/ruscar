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

  async getCar(_id: string): Promise<CarDocument | null> {
    return await this.carModel.findById(_id);
  }

  showCarForUser(car: CarDocument) {
    return {
      showText: `🚘 <b>${car.marka} ${car.model} ${car.age}</b>\n${car.vin}\n${car.info}`,
      showMedia: car.media,
    };
  }

  async getMyCars(tId: number): Promise<CarDocument[]> {
    const cars = await this.carModel.find({ ownerTid: tId });
    return cars;
  }

  async createCar(car: Car): Promise<CarDocument> {
    // if (!car) return null;
    const created = new this.carModel(car);
    return created.save();
  }
}
