import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignUpInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: false })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: false })
  password?: string;

  @Field({ nullable: true })
  photo?: string;
}
