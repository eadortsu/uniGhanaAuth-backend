import { InputType, Field, PartialType } from '@nestjs/graphql';
import { SignUpInput } from '../../auth/dto/sign-up-input.dto';

@InputType()
export class UpdateUserInput extends PartialType(SignUpInput) {
  @Field(() => String)
  _id: string;

  @Field(() => String, { nullable: true })
  reset_code?: string;

  @Field(() => Date, { nullable: true, description: 'last login' })
  last_login?: Date;
}
