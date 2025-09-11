import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserDocument } from 'src/user/user.schema';
import { AppDocument } from 'src/app/app.schema';
import { BotMessage } from './bot.message';
import { CarService } from 'src/car/car.service';
import { Car } from 'src/car/car.schema';

@Injectable()
export class BotService {
  constructor(
    @Inject(forwardRef(() => BotMessage))
    private botMessage: BotMessage,
    private carService: CarService,
  ) {
    console.log('BotService initialized');
  }

  async createCar(user: UserDocument, app: AppDocument, car: Car) {
    const newCar = await this.carService.createCar(car);
    console.log(newCar);
    // const topText = 'Русификация';
    // const downText = 'Запрос';
    // const keyboard = [
    //   [{ text: 'Добавить авто', callback_data: 'test' }],
    //   [{ text: 'Инструкция', callback_data: 'help' }],
    // ];
    // const media = [];
    // await this.botMessage.sendTopDownMessage(
    //   user,
    //   app,
    //   topText,
    //   downText,
    //   media,
    //   keyboard,
    // );
  }

  async start(user: UserDocument, app: AppDocument) {
    const topText = 'Русификация';
    const downText = 'Запрос';
    const keyboard = [
      [{ text: 'Добавить авто', callback_data: 'test' }],
      [{ text: 'Инструкция', callback_data: 'help' }],
    ];
    const media = [];
    await this.botMessage.sendTopDownMessage(
      user,
      app,
      topText,
      downText,
      media,
      keyboard,
    );
  }
}
