import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserDocument } from 'src/user/user.schema';
import { AppDocument } from 'src/app/app.schema';
import { BotMessage } from './bot.message';
import { CarService } from 'src/car/car.service';
import { Car, CarDocument } from 'src/car/car.schema';
import { AppService } from 'src/app/app.service';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf'

@Injectable()
export class BotService {
  constructor(
    @InjectBot() private bot: Telegraf,
    @Inject(forwardRef(() => BotMessage))
    private botMessage: BotMessage,
    private carService: CarService,
    private appService: AppService,
  ) {
    console.log('BotService initialized');
  }

  async deleteCar(user: UserDocument, app: AppDocument, _id: string) {
    const car = await this.carService.deleteCar(_id, user.tId);
    if (!car) {
      await this.start(user, app);
      return;
    }
    const cars = await this.carService.getMyCars(user.tId);
    if (cars.length) {
      await this.myCars(user, app);
      return;
    }
    await this.start(user, app);
  }

  async showCar(user: UserDocument, app: AppDocument, _id: string) {
    const car = await this.carService.getCar(_id);
    if (!car) {
      await this.start(user, app);
      return;
    }
    const { showText, showMedia } = this.carService.showCarForUser(car);
    const topText = showText;
    const downText = 'Авто';
    const keyboard = [
      [
        { text: 'Назад', callback_data: 'myCars' },
        { text: 'В начало', callback_data: 'startScreen' },
        { text: 'Изменить', callback_data: `editCar|${car._id.toString()}` },
        { text: 'Удалить', callback_data: `deleteCar|${car._id.toString()}` },
      ],
    ];
    const media = showMedia;
    await this.botMessage.sendTopDownMessage(
      user,
      app,
      topText,
      downText,
      media,
      keyboard,
    );
  }

  async showCarOne(user: UserDocument, app: AppDocument, _id: string) {
    const car = await this.carService.getCar(_id);
    if (!car) {
      await this.start(user, app);
      return;
    }
    const { showText, showMedia } = this.carService.showCarForUser(car);
    const topText = showText;
    const downText = 'Авто';
    const keyboard = [
      [
        { text: 'Назад', callback_data: 'startScreen' },
        { text: 'Изменить', callback_data: `editCar|${car._id.toString()}` },
        { text: 'Удалить', callback_data: `deleteCar|${car._id.toString()}` },
      ],
    ];
    const media = showMedia;
    await this.botMessage.sendTopDownMessage(
      user,
      app,
      topText,
      downText,
      media,
      keyboard,
    );
  }

  async myCars(user: UserDocument, app: AppDocument) {
    const cars = await this.carService.getMyCars(user.tId);
    if (cars.length === 1) {
      await this.showCarOne(user, app, cars[0]._id.toString());
      return;
    }
    const topText = '🚙 '.repeat(cars.length);
    const downText = 'Мои авто';
    const keyboard = [[{ text: 'Назад', callback_data: 'startScreen' }]];
    for (const car of cars) {
      keyboard.push([
        {
          text: car.marka + ' ' + car.model + ' ' + car.age,
          callback_data: `car|${car._id.toString()}`,
        },
      ]);
    }
    keyboard.reverse();
    const media = cars.map((c) => c.media[0]);
    await this.botMessage.sendTopDownMessage(
      user,
      app,
      topText,
      downText,
      media,
      keyboard,
    );
  }

  async updateCar(user: UserDocument, app: AppDocument, car: CarDocument) {
    const newCar = await this.carService.updateCar(car, user.tId);
    if (!newCar) {
      await this.start(user, app);
      return;
    }
    const { showText, showMedia } = this.carService.showCarForUser(newCar);
    const cars = await this.carService.getMyCars(user.tId);
    const topText = showText;
    const downText = '✅ Успешно обновлено';
    const keyboard = [
      [{ text: 'Добавить авто', callback_data: 'addcar' }],
      [{ text: 'О нас', callback_data: 'about' }],
    ];
    const media = showMedia;
    if (cars.length) {
      keyboard[0].push({
        text: `Мои авто ${cars.length > 1 ? `(${cars.length})` : ''}`,
        callback_data: 'myCars',
      });
    }
    await this.botMessage.sendTopDownMessage(
      user,
      app,
      topText,
      downText,
      media,
      keyboard,
    );
  }

  async createCar(user: UserDocument, app: AppDocument, car: Car) {
    const newCar = await this.carService.createCar(car);
    const { showText, showMedia } = this.carService.showCarForUser(newCar);
    const cars = await this.carService.getMyCars(user.tId);
    const topText = showText;
    const downText = '✅ Успешно добавлено';
    const keyboard = [
      [{ text: 'Добавить авто', callback_data: 'addcar' }],
      [{ text: 'О нас', callback_data: 'about' }],
    ];
    const media = showMedia;
    if (cars.length) {
      keyboard[0].push({
        text: `Мои авто ${cars.length > 1 ? `(${cars.length})` : ''}`,
        callback_data: 'myCars',
      });
    }
    await this.botMessage.sendTopDownMessage(
      user,
      app,
      topText,
      downText,
      media,
      keyboard,
    );
  }

  async start(user: UserDocument, app: AppDocument) {
    const cars = await this.carService.getMyCars(user.tId);
    const topText = 'Русификация';
    const downText = 'Главный экран';
    const keyboard = [
      [{ text: 'Добавить авто', callback_data: 'addcar' }],
      [{ text: 'О нас', callback_data: 'about' }],
    ];
    const media = [];
    if (cars.length) {
      keyboard[0].push({
        text: `Мои авто ${cars.length > 1 ? `(${cars.length})` : ''}`,
        callback_data: 'myCars',
      });
    }
    await this.botMessage.sendTopDownMessage(
      user,
      app,
      topText,
      downText,
      media,
      keyboard,
    );
  }

  async getAuthLink(user: UserDocument, app: AppDocument) {
    const link = this.appService.getAuthLink(user.tId);
    const topText = 'Вход в веб панель';
    const downText = `<code>${link}</code>`;
    const keyboard = [
      [{ text: 'Вход', url: `${link}` }],
      [{ text: 'Назад', callback_data: 'startScreen' }],
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
