import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car, CarDocument, StatusCar } from './car.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { rendomNumberOrder } from 'src/tech/rendomNumberOrder';
import { rendomLetteOrder } from 'src/tech/rendomLetteOrder';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf'

@Injectable()
export class CarService {
  constructor(
    @InjectBot() private bot: Telegraf,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    private readonly config: ConfigService,
  ) {
    console.log('CarService initialized');
  }

  async statusCar(_id: string, status: StatusCar, tId: number): Promise<CarDocument | null> {
    return await this.carModel.findOneAndUpdate({ _id: _id }, {status: status, $push: {
          dataHistoryLine: { tId, text: `Статус изменен на "${status}"`, date: Date.now() },
        },}, { new: true });
  }

  async deleteCarTotal(_id: string): Promise<CarDocument | null> {
    return await this.carModel.findOneAndDelete({ _id: _id });
  }

  async updateCarHistory(_id: string, text: string, tId: number): Promise<CarDocument | null> {
    return await this.carModel.findOneAndUpdate(
      { _id: _id },
      {
        $push: {
          dataHistoryLine: { tId, text, date: Date.now() },
        },
      },
      { new: true },
    );
  }

  async getCarPhotos(_id: string){
    const res = await this.getCar(_id);
    if(res){
      const bufferArray: string[] = []
      for(const i of res.media.filter(item => item.type === 'photo').map(item => item.file_id)){
        const url = await this.bot.telegram.getFileLink(i)
        const buffer: ArrayBuffer = await (await fetch(url.href)).arrayBuffer()
        bufferArray.push(Buffer.from(buffer).toString('base64')) 
      }
      return bufferArray
    }
    return []
  }

  async getCars(): Promise<CarDocument[]> {
    return await this.carModel.find({});
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
      showText: `<b>Запрос: ${car.order}</b>\n🚘▫️▫️▫️▫️▫️▫️▫️▫️\n<b>${car.marka} ${car.model} ${car.age}</b>\n${car.vin}\n${car.info}`,
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
    const index = rendomNumberOrder({min: 1000, max: 9999}) + '_' + rendomLetteOrder() + rendomLetteOrder() + rendomLetteOrder();
    const created = new this.carModel({...car, order: index});
    return created.save();
  }
}
