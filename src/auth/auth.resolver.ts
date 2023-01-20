import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginInput } from './dto/login-input.dto';
import { AuthOutput } from './dto/auth-output.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ResetOutput } from './dto/reset-output.dto';
import { RestInput } from './dto/reset-input.dto';
import { User } from '../user/entities/user.entity';
import { SignUpInput } from './dto/sign-up-input.dto';
import { GqlAuthGuard } from './graphql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Query(() => User, { description: 'Get currently login user' })
  @UseGuards(GqlAuthGuard)
  me(@Context('user') user: User) {
    return this.userService.findOne({ _id: user._id });
  }

  @Mutation(() => AuthOutput, {
    description: 'Login user with email and  password',
  })
  async login(@Args('user') loginInput: LoginInput) {
    return await this.authService.login(loginInput);
  }

  @Mutation(() => AuthOutput, {
    description: 'Create User and login user',
  })
  async signup(@Args('user') signUpInput: SignUpInput) {
    return await this.authService.signup(signUpInput);
  }

  @Mutation(() => AuthOutput, {
    description: 'Login user with email from social',
    nullable: true,
  })
  async socialLogin(
    @Args('email') email: string,
    @Args('token', { nullable: true }) token?: string,
    @Args('fcm', { nullable: true }) fcm?: string,
  ) {
    return null;
  }

  @Mutation(() => ResetOutput, {
    description: 'Reset Password using email or phone',
  })
  async sendRestLink(@Args('user') { email }: RestInput) {
    return await this.authService.sendRestLink(email);
  }

  @Query(() => User, {
    description: 'Check Reset User',
  })
  async checkRestLink(@Args('reset_code') reset_code: string) {
    return await this.authService.checkRestLink(reset_code);
  }

  @Mutation(() => AuthOutput, {
    description: 'Check Reset User',
  })
  async resetPassword(
    @Args('reset_code') reset_code: string,
    @Args('password') password: string,
  ) {
    return await this.authService.resetPassword(reset_code, password);
  }
}
