import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { UserType } from '../types/user.type';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserType], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => UserType, { name: 'user' })
  findById(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }
}
