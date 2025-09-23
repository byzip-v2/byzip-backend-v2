import { UsersModel } from 'src/users/entities/users.entity';

declare global {
  namespace Express {
    interface Request {
      user?: UsersModel;
    }
  }
}
