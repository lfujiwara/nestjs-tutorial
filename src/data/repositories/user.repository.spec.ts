import * as faker from 'faker';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '@nestjs/config';
import { Pool } from 'pg';
import { User } from '../../core/user';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.test'],
        }),
      ],
      providers: [Pool, UserRepository],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    const pool = module.get<Pool>(Pool);
    pool.query('DELETE FROM users;');
  });

  afterAll(async () => {
    const pool = module.get<Pool>(Pool);
    await pool.end();
    await module.close();
  });

  const makeInput = () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return {
      username: faker.internet
        .userName(firstName, lastName)
        .replace(/[\W_.]/, ''),
      email: faker.internet.email(firstName, lastName),
      password: faker.internet.password(12),
    };
  };

  test('Registers an user to the database', async () => {
    const sampleUser = await User.create(makeInput());
    await repository.registerNewUser(sampleUser);

    expect(sampleUser.id).toBeTruthy();
  });

  test('Verify if email is registered', async () => {
    const sampleUser = await User.create(makeInput());

    await expect(
      repository.isEmailRegistered(sampleUser.email),
    ).resolves.toStrictEqual(false);
    await repository.registerNewUser(sampleUser);
    await expect(
      repository.isEmailRegistered(sampleUser.email),
    ).resolves.toStrictEqual(true);
  });

  test('Verify if username is registered', async () => {
    const sampleUser = await User.create(makeInput());

    await expect(
      repository.isUsernameRegistered(sampleUser.username),
    ).resolves.toStrictEqual(false);
    await repository.registerNewUser(sampleUser);
    await expect(
      repository.isUsernameRegistered(sampleUser.username),
    ).resolves.toStrictEqual(true);
  });
});
