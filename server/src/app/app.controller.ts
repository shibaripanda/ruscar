import { Controller, ForbiddenException, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('access/:token')
  async checkToken(@Param('token') startToken: string) {
    const res = await this.appService.validateToken(startToken);
    if (!res) {
      throw new ForbiddenException('Недействительный токен');
    }
    return { token: res.token };
  }
}
