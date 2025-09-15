import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BotModule } from 'src/bot/bot.module';
import { AppSchema } from './app.schema';
import { JwtModule } from '@nestjs/jwt';
import { CarModule } from 'src/car/car.module';
import { AppGateway } from './app.gateway';
import { SocketAuthMiddleware } from './auth-guards/socket-auth.middleware';
import { UserModule } from 'src/user/user.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev', '.env.prod'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_TOKEN')!,
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('LIFI_TIME_TOKEN'),
        },
      }),
    }),
    MongooseModule.forFeature([{ name: 'App', schema: AppSchema }]),
    BotModule,
    CarModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, SocketAuthMiddleware],
  exports: [AppService],
})
export class AppModule {}
