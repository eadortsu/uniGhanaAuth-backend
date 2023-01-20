import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpInput } from '../auth/dto/sign-up-input.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(signUpInput: SignUpInput) {
    const user = new this.userModel(signUpInput);
    return await user.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  async findOne(param = {}) {
    return await this.userModel.findOne(param).exec();
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      updateUserInput.password = await bcryptjs.hash(
        updateUserInput.password,
        10,
      );
    } else {
      delete updateUserInput.password;
    }
    const existingUser = await this.userModel
      .findOneAndUpdate({ _id: id }, { $set: updateUserInput }, { new: true })
      .exec();

    if (!existingUser) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return existingUser;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return user.remove();
  }
}
