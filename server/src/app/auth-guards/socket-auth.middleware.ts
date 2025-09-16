import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenData } from '../interfaces/tokenData';
import { AuthenticatedSocket } from '../interfaces/authenticatedSocket';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SocketAuthMiddleware {
  constructor(private jwt: JwtService, private userService: UserService) {}
  async use(socket: AuthenticatedSocket, next: (err?: any) => void) {
    const token: string | undefined = (
      socket.handshake.auth as { token?: string }
    )?.token;

    if (!token || typeof token !== 'string') {
      return next(new UnauthorizedException('Token not provided'));
    }

    try {
      const payload = this.jwt.verify<TokenData>(token);
      const user = await this.userService.getUser(Number(payload.userId))
      if (!user) return;
      socket.data.user = user;
      console.log('SocketAuthMiddleware');
      next();
    } catch (err) {
      console.log(err);
      return next(new UnauthorizedException('Invalid token'));
    }
  }
}
