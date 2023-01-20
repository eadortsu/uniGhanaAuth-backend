import { InputType, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResetOutput {
  @Field({ nullable: true })
  msg?: string;

  @Field({ nullable: true })
  status?: boolean;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: boolean;
}
