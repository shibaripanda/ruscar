import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketAuthMiddleware } from 'src/app/auth-guards/socket-auth.middleware';
import { AppService } from './app.service';
import { UserService } from 'src/user/user.service';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/bot/bot.gateway';
import { RoleGuardSocket } from './auth-guards/access-auth.guard';
import { StatusCar } from 'src/car/car.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly socketAuthMiddleware: SocketAuthMiddleware,
    // private readonly botService: BotService,
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;

  private _emitUsersUpdate() {
    console.log('upUsers');
    this.server.emit('upUsers', Date.now());
  }

  private _emitDataUpdate() {
    console.log('upData');
    this.server.emit('upData', Date.now());
  }

  upUsers: () => void;
  upData: () => void;

  afterInit(server: Server) {
    server.use((socket, next) => {
      void this.socketAuthMiddleware.use(socket, next);
    });
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('statusCar')
  async statusCar(client: Socket, payload: {_id: string, status: StatusCar}): Promise<any> {
    const car = await this.appService.statusCar(payload._id, payload.status, client.data.user.tId as number);
    return car ? {status: car.status, dataHistoryLine: car.dataHistoryLine} : false;
  }

  @UseGuards(RoleGuardSocket)
  @Roles('superadmin')
  @SubscribeMessage('deleteCar')
  async deleteCar(client: Socket, payload: {_id: string}): Promise<any> {
    const del = await this.appService.deleteCar(payload._id);
    return del ? true : false;
  }

  @SubscribeMessage('addHistory')
  async addHistory(client: Socket, payload: {_id: string, text: string}): Promise<any> {
    console.log(client.data, payload)
    const car = await this.appService.addHistory(payload._id, payload.text, client.data.user.tId as number);
    return car ? car.dataHistoryLine : [];
  }

  @SubscribeMessage('getMedia')
  async getMedia(client: Socket, payload: {_id: string}): Promise<any> {
    const mediaBuffer = await this.appService.getMedia(payload._id);
    return mediaBuffer ? mediaBuffer : [];
  }

  @SubscribeMessage('getGarage')
  async getGarage(client: Socket, payload: string[]): Promise<any> {
    const cars = await this.appService.getGarage();
    return cars ? cars : [];
  }

}
