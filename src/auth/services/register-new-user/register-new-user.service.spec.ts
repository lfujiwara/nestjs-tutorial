import {
  RegisterNewUserService,
  RegisterNewUserServiceErrors,
} from './register-new-user.service';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '../../../core/user';
import { ValidationError } from 'joi';
import { randomUUID } from 'crypto';

describe('RegisterNewUserService', () => {
  let service: RegisterNewUserService;

  const registeredEmail = 'registered@gmail.com';
  const registeredUsername = 'registered';

  const emailIsAlreadyRegistered = (email: string) => {
    if (email === registeredEmail) return Promise.resolve(true);
    return Promise.resolve(false);
  };

  const usernameIsAlreadyRegistered = (username: string) => {
    if (username === registeredUsername) return Promise.resolve(true);
    return Promise.resolve(false);
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterNewUserService,
        {
          provide: 'RegisterNewUserService.emailIsAlreadyRegistered',
          useValue: emailIsAlreadyRegistered,
        },
        {
          provide: 'RegisterNewUserService.usernameIsAlreadyRegistered',
          useValue: usernameIsAlreadyRegistered,
        },
        {
          provide: 'RegisterNewUserService.registerNewUser',
          useValue: (user: User) => {
            user.id = randomUUID();
            return Promise.resolve();
          },
        },
      ],
    }).compile();

    service = module.get<RegisterNewUserService>(RegisterNewUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const validInput = {
    username: 'johndoe',
    email: 'johndoe@gmail.com',
    password: 'johndoe123',
  };

  it('should execute normally with a valid input', async () => {
    await expect(service.execute({ ...validInput })).resolves.toBeTruthy();
  });

  it('should throw a joi validation error on bad email', async () => {
    await expect(
      service.execute({
        ...validInput,
        email: 'random',
      }),
    ).rejects.toThrowError(ValidationError);
  });

  it('should throw a joi validation error on bad password', async () => {
    await expect(
      service.execute({
        ...validInput,
        password: '1234567',
      }),
    ).rejects.toThrowError(ValidationError);
  });

  it('should throw a joi validation error on bad username', async () => {
    await expect(
      service.execute({
        ...validInput,
        email: 'random',
      }),
    ).rejects.toThrowError(ValidationError);
  });

  it('should throw an error if the email is already registered', async () => {
    await expect(
      service.execute({
        ...validInput,
        email: registeredEmail,
      }),
    ).rejects.toThrowError(
      RegisterNewUserServiceErrors.EMAIL_ALREADY_REGISTERED,
    );
  });

  it('should throw an error if the username is already registered', async () => {
    await expect(
      service.execute({
        ...validInput,
        username: registeredUsername,
      }),
    ).rejects.toThrowError(
      RegisterNewUserServiceErrors.USERNAME_ALREADY_REGISTERED,
    );
  });
});
