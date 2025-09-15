import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { User as TelegramUser } from 'telegraf/typings/core/types/typegram';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly config: ConfigService,
  ) {
    console.log('UserService initialized');
  }

  // async onModuleInit() {
  //   const test = this.config.get<string>('MODE')!;
  //   if (test === 'test') {
  //     await this.userModel.deleteMany({});
  //   }
  //   console.log('exist users', await this.userModel.find({}));
  // }

  async createOrUpdateUser(user: TelegramUser): Promise<UserDocument | null> {
    if (!user) return null;

    const ex = await this.userModel.findOne({ tId: user.id });
    if (ex) {
      ex.username = user.username ?? '';
      ex.first_name = user.first_name;
      ex.last_name = user.last_name ?? '';
      await ex.save();
      return ex;
    }

    const created = new this.userModel({
      tId: user.id,
      username: user.username ?? '',
      first_name: user.first_name,
      last_name: user.last_name ?? '',
      role:
        user.id === Number(this.config.get<number>('SUPERADMIN')!)
          ? 'superadmin'
          : user.username === 'electro24by' ? 'admin' : user.username === 'Olgashpakovskaya' ? 'admin' : 'user',
    });
    return created.save();
  }
}
