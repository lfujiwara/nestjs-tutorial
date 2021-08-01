import {
  RegisterNewUserService,
  RegisterNewUserServiceErrors,
} from '../src/auth/services/register-new-user/register-new-user.service';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '@nestjs/config';
import { Pool } from 'pg';
import { UserRepository } from '../src/data/repositories/user.repository';

describe('RegisterNewUserService + UserRepository', () => {
  let service: RegisterNewUserService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.test'],
        }),
      ],
      providers: [
        Pool,
        UserRepository,
        {
          provide: 'RegisterNewUserService.emailIsAlreadyRegistered',
          useFactory: (repo: UserRepository) =>
            repo.isEmailRegistered.bind(repo),
          inject: [UserRepository],
        },
        {
          provide: 'RegisterNewUserService.usernameIsAlreadyRegistered',
          useFactory: (repo: UserRepository) =>
            repo.isUsernameRegistered.bind(repo),
          inject: [UserRepository],
        },
        {
          provide: 'RegisterNewUserService.registerNewUser',
          useFactory: (repo: UserRepository) => repo.registerNewUser.bind(repo),
          inject: [UserRepository],
        },
        RegisterNewUserService,
      ],
    }).compile();

    service = module.get<RegisterNewUserService>(RegisterNewUserService);
  });

  afterEach(async () => {
    const pool = module.get<Pool>(Pool);
    await pool.query('DELETE FROM users;');
  });

  afterAll(async () => {
    const pool = module.get<Pool>(Pool);
    await pool.end();
    await module.close();
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

  it('should throw an error if the email is already registered', async () => {
    await service.execute({
      ...validInput,
      username: 'johndoe2',
    });

    await expect(
      service.execute({
        ...validInput,
      }),
    ).rejects.toThrowError(
      RegisterNewUserServiceErrors.EMAIL_ALREADY_REGISTERED,
    );
  });

  it('should throw an error if the username is already registered', async () => {
    await service.execute({
      ...validInput,
      email: 'johndoe2@gmail.com',
    });

    await expect(
      service.execute({
        ...validInput,
      }),
    ).rejects.toThrowError(
      RegisterNewUserServiceErrors.USERNAME_ALREADY_REGISTERED,
    );
  });
});
