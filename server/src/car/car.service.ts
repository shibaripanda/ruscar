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

  async deleteCar(_id: string, tId: number): Promise<CarDocument | null> {
    // return await this.carModel.findByIdAndDelete(_id);
    return await this.carModel.findOneAndUpdate(
      { _id: _id },
      {
        ownerTid: 101,
        vin: 101,
        deleted: true,
        $push: {
          dataHistoryLine: { tId: tId, text: 'Удалено', date: Date.now() },
        },
      },
      { new: true },
    );
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

  async updateCar(car: CarDocument, tId: number): Promise<CarDocument | null> {
    await this.carModel.findOneAndUpdate(
      { _id: car._id },
      { ...car },
      { new: true },
    );
    return await this.carModel.findOneAndUpdate(
      { _id: car._id },
      {
        $push: {
          dataHistoryLine: { tId: tId, text: 'Обновлено', date: Date.now() },
        },
      },
      { new: true },
    );
  }

  async createCar(car: Car): Promise<CarDocument> {
    // if (!car) return null;
    const created = new this.carModel(car);
    return created.save();
  }
}
