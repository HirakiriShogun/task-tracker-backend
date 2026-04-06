import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  fullName: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
