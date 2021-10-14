import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './shared/interface/model.interface';

@Injectable()
export class DataInitService implements OnApplicationBootstrap {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  onApplicationBootstrap() {
    this.createUserIfNotExists();
  }
  async createUserIfNotExists() {
    try {
      const userExist = await this.userModel.find({}).lean().exec();

      if (!userExist || userExist.length === 0) {
        const userCreate = await this.userModel.create({
          email: 'test@test.com',
          name: 'Test Test',
        });
        console.log('user created successfully!', userCreate);
      }
    } catch (error) {
      console.log('Error while initializing user data', error);
    }
  }
}
