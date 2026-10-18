import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.userModel.findByPk(id);
  }

  create(email: string, passwordHash: string) {
    return this.userModel.create({ email, passwordHash });
  }
}
