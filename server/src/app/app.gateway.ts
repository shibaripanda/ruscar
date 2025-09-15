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
// import { BotService } from 'src/bot/bot.service';
import { AppService } from './app.service';
import { UserService } from 'src/user/user.service';
import { Req } from '@nestjs/common';

// interface SocketUserData {
//   data: {
//     user: {
//       userId: number;
//       username?: string;
//       // любые другие поля, которые ты добавляешь в гварде
//     };
//   };
// }

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

  @SubscribeMessage('addHistory')
  async addHistory(client: Socket, payload: {_id: string, text: string}): Promise<any> {
    console.log(client.data, payload)
    const car = await this.appService.addHistory(payload._id, payload.text, client.data.user.userId as number);
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
}
