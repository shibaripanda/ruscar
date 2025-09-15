import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AppDocument } from './app.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { TokenData } from './interfaces/tokenData';
import { v4 as uuidv4 } from 'uuid';
import { TokenAndUserId } from './interfaces/tokenAndUserId';
import { JwtService } from '@nestjs/jwt';
import { CarService } from 'src/car/car.service';

@Injectable()
export class AppService {
  public tokens = new Map<string, TokenData>();
  constructor(
    @InjectModel('App') private appMongo: Model<AppDocument>,
    private config: ConfigService,
    private jwt: JwtService,
    private carService: CarService,
  ) {
    console.log('AppService initialized');
  }

  async onModuleInit() {
    await this.appMongo.findOneAndUpdate(
      { docName: 'settings' },
      { $setOnInsert: { docName: 'settings' } },
      { upsert: true },
    );
  }

  async addHistory(_id: string, text: string, tId: number): Promise<any> {
    return await this.carService.updateCarHistory(_id, text, tId);
  }

  async getMedia(_id: string): Promise<any> {
    return await this.carService.getCarPhotos(_id);
  }

  async getGarage() {
    return await this.carService.getCars()
  }

  async getAppSettings(): Promise<AppDocument | null> {
    return await this.appMongo.findOne({ docName: 'settings' });
  }

  getAuthLink(id: number): string {
    const token = this.generateToken(String(id));
    return `${this.config.get<string>('WEB_URL')}/#/?token=${token}`;
  }

  generateToken(userId: string): string {
    const now = Date.now();
    for (const [token, data] of this.tokens.entries()) {
      if (data.expiresAt <= now) {
        this.tokens.delete(token);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const token: string = uuidv4();
    const expiresAt = now + 10 * 60 * 1000; // 10 минут
    this.tokens.set(token, { userId, used: false, expiresAt });
    return token;
  }

  async validateToken(token: string): Promise<TokenAndUserId | null> {
    console.log(this.tokens);
    const data: TokenData | undefined = this.tokens.get(token);
    if (!data || data.used || data.expiresAt < Date.now()) return null;

    data.used = true;
    this.tokens.set(token, data);
    this.tokens.delete(token);
    console.log(this.tokens);
    return {
      token: await this.jwt.signAsync({ userId: data.userId }),
      userId: data.userId,
    };
  }
}
