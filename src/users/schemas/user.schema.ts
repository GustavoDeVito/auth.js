import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { StatusEnum } from '../enum/status.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ autoCreate: true, timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
