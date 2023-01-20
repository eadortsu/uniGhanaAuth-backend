import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RestInput {
  @Field({ nullable: true })
  email?: string;
}
