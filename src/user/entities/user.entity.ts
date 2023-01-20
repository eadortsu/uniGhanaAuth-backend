import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
@ObjectType()
export class User {
  @Field(() => String)
  _id: string;

  @Prop()
  @Field(() => String, { nullable: true, description: 'Full Name ' })
  name?: string;

  @Prop()
  @Field(() => String, { nullable: true, description: 'Full Name ' })
  username?: string;

  @Prop()
  @Field(() => String, { nullable: true, description: 'User bio' })
  bio?: string;

  @Prop()
  @Field(() => String, { nullable: true, description: 'Phone Number' })
  phone?: string;

  @Prop()
  @Field(() => String, { description: 'User email ' })
  email: string;

  @Prop()
  @Field(() => String, { description: 'Password' })
  password: string;

  @Prop()
  @Field(() => String, { nullable: true, description: 'Photo' })
  photo?: string;

  @Prop()
  @Field(() => String, { nullable: true, description: 'reset code' })
  reset_code?: string;

  @Prop()
  @Field(() => Date, { nullable: true, description: 'last login' })
  last_login?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
