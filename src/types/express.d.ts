import { UsersModel } from '../users/entities/users.entity';

declare global {
  namespace Express {
    interface Request {
      user?: UsersModel;
    }
  }
}
