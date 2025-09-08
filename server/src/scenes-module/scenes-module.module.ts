import { Module } from '@nestjs/common';
import { BotMessage } from 'src/bot/bot.message';
import { AddNewCarScene } from 'src/bot/scenes/addNewCar.scene';

@Module({
  providers: [AddNewCarScene, BotMessage],
})
export class ScenesModule {}
