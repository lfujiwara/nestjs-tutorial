import * as Joi from 'joi';

import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../core/user';

type RegisterNewUserServiceRequest = {
  username: string;
  email: string;
  password: string;
};

const RegisterNewUserServiceRequestSchema =
  Joi.object<RegisterNewUserServiceRequest>({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(64).required(),
    username: Joi.string().min(3).alphanum().required(),
  });

type RegisterNewUserServiceResponse = {
  id: any;
  username: string;
  email: string;
};

export const RegisterNewUserServiceErrors = {
  EMAIL_ALREADY_REGISTERED: 'EMAIL_ALREADY_REGISTERED',
  USERNAME_ALREADY_REGISTERED: 'USERNAME_ALREADY_REGISTERED',
};

@Injectable()
export class RegisterNewUserService {
  constructor(
    @Inject('RegisterNewUserService.emailIsAlreadyRegistered')
    private emailIsAlreadyRegistered: (email: string) => Promise<boolean>,
    @Inject('RegisterNewUserService.usernameIsAlreadyRegistered')
    private usernameIsAlreadyRegistered: (username: string) => Promise<boolean>,
    @Inject('RegisterNewUserService.registerNewUser')
    private registerNewUser: (user: User) => Promise<void>,
  ) {}

  async execute(
    request: RegisterNewUserServiceRequest,
  ): Promise<RegisterNewUserServiceResponse> {
    Joi.assert(request, RegisterNewUserServiceRequestSchema);

    if (await this.emailIsAlreadyRegistered(request.email)) {
      throw new Error(RegisterNewUserServiceErrors.EMAIL_ALREADY_REGISTERED);
    }

    if (await this.usernameIsAlreadyRegistered(request.username)) {
      throw new Error(RegisterNewUserServiceErrors.USERNAME_ALREADY_REGISTERED);
    }

    const user = await User.create(request);

    await this.registerNewUser(user);

    return user as RegisterNewUserServiceResponse;
  }
}
