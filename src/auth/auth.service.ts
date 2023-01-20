import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import moment from 'moment';
import { LoginInput } from './dto/login-input.dto';
import { JwtService } from '@nestjs/jwt';
import { SignUpInput } from './dto/sign-up-input.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  async validate({ _id }): Promise<User> {
    const user = await this.userService.findOne({ _id });
    if (!user) {
      throw Error('Authenticate validation error');
    }
    return user;
  }

  async login(logininput: LoginInput): Promise<User | null> {
    let user = await this.userService.findOne({ email: logininput.email });
    if (!user) {
      throw Error('Email or password incorrect');
    }
    const valid = await bcryptjs.compare(logininput.password, user.password);
    if (!valid) {
      throw Error('Email or password incorrect');
    }
    user = await this.userService.update(user._id, {
      _id: user._id,
      last_login: new Date(),
    });
    const jwt = this.jwt.sign({
      _id: user._id,
    });
    return { ...user.toObject(), ...{ token: jwt } };
  }

  async signup(signUpInput: SignUpInput): Promise<User | null> {
    const emailExists = await this.userService.findOne({
      email: signUpInput.email,
    });
    if (emailExists) {
      throw Error('Email is already in use');
    }
    signUpInput.password = await bcryptjs.hash(signUpInput.password, 10);
    let user = await this.userService.create(signUpInput);
    user = await this.userService.update(user._id, {
      _id: user._id,
      last_login: new Date(),
    });
    const jwt = this.jwt.sign({
      _id: user._id,
    });

    return { ...user.toObject(), ...{ token: jwt } };
  }

  async socialLogin(email: string): Promise<User | null> {
    const user = await this.userService.findOne({ email });
    if (user) {
      const jwt = this.jwt.sign({
        _id: user._id,
      });
      return { ...user.toObject(), ...{ token: jwt } };
    }
  }

  async checkRestLink(reset_code: string) {
    const user = await this.userService.findOne({ reset_code });
    if (user) {
      const now = new Date().getTime();
      const currentTime = moment(now);
      const expire = moment(reset_code, 'X');

      if (currentTime.isBefore(expire)) {
        return user;
      } else {
        throw Error('Link has expired');
      }
    } else {
      throw Error('Invalid Reset Link');
    }
  }

  async resetPassword(reset_code: string, password: string) {
    const user = await this.userService.findOne({ reset_code });
    if (!user) {
      throw Error('Invalid Reset Link');
    }
    password = await bcryptjs.hash(password, 10);
    await this.userService.update(user._id, {
      _id: user._id,
      password,
      reset_code: null,
    });
    const jwt = this.jwt.sign({
      _id: user._id,
    });
    return { ...user.toObject(), ...{ token: jwt } };
  }

  async sendRestLink(email: string) {
    const user = await this.userService.findOne({ email });
    if (!user) {
      throw Error('Email dose not exist');
    }
    const now = new Date().getTime();
    const time = moment(now).format('X');
    const expire = moment(now).add(1, 'h').format('X');
    await this.userService.update(user._id, {
      _id: user._id,
      reset_code: expire,
    });
    //TODO
    const link =
      'https://admin.heny.app/account/reset-password/' +
      time +
      '-' +
      user.id +
      '-' +
      expire;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: {
        name: user.name,
        email: user.email,
      },
      from: {
        email: 'info@heny.app',
        name: 'Heny App',
      },
      subject: 'Reset your Dabo Password',
      templateId: 'd-68958342e1a84cd5a4744fafaa50aa43',
      dynamic_template_data: {
        name: user.name,
        link,
      },
      hideWarnings: true, // now the warning won't be logged
    };
    sgMail
      .send(msg)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        if (error.response) {
          throw Error(error.response.body);
        }
        throw Error(error);
      });

    return {
      email: email,
      phone: user.phone,
      msg: `Password reset link has been sent to ${email}`,
      status: true,
    };
  }
}
