import { ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
// import { TokenData } from './tokenData';
import { UserDocument } from 'src/user/user.schema';

export interface AuthenticatedSocket extends Socket {
  data: {
    user: UserDocument;
  };
}

export interface ContextWithUserApp extends ExecutionContext {
  user: UserDocument;
}
