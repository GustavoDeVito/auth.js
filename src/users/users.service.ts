import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hashSync } from 'bcrypt';
import { Model, ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { StatusEnum } from './enum/status.enum';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const exist = await this.userModel
      .exists({ username: createUserDto?.username })
      .exec();

    if (exist) {
      throw new BadRequestException('Username already exists');
    }

    const user = new this.userModel({
      ...createUserDto,
      password: hashSync(createUserDto.password, 10),
    });

    return user.save();
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: ObjectId): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  findOneByUser(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const exist = await this.userModel.findById(id).exec();

    if (!exist) {
      throw new NotFoundException('User not found');
    }

    const { name } = updateUserDto;

    return this.userModel.findByIdAndUpdate(id, { name }, { new: true });
  }

  status(id: string, status: string) {
    const st = StatusEnum[status.toUpperCase()];

    if (!st) {
      throw new BadRequestException(
        'Invalid status: [active, inactive, block]',
      );
    }

    return this.userModel.findByIdAndUpdate(
      id,
      {
        status: st,
      },
      { new: true },
    );
  }
}
