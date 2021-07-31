import { User } from './user';
import { ValidationError } from 'joi';

describe('User entity', () => {
  const validInput = {
    username: 'johndoe',
    email: 'johndoe@gmail.com',
    password: 'johndoe123',
  };

  it('should execute normally with a valid input', async () => {
    await expect(User.create(validInput)).resolves.toBeTruthy();
  });

  it('should throw a joi validation error on bad email', async () => {
    expect(
      User.create({
        ...validInput,
        email: 'random',
      }),
    ).rejects.toThrowError(ValidationError);
  });

  it('should throw a joi validation error on bad password', async () => {
    expect(
      User.create({
        ...validInput,
        password: '1234567',
      }),
    ).rejects.toThrowError(ValidationError);
  });

  it('should throw a joi validation error on bad username', async () => {
    expect(
      User.create({
        ...validInput,
        email: 'random',
      }),
    ).rejects.toThrowError(ValidationError);
  });

  it('should return true for a valid password', async () => {
    const user = await User.create(validInput);
    await expect(
      user.verifyPassword(validInput.password),
    ).resolves.toBeTruthy();
  });

  it('should return false for an invalid password', async () => {
    const user = await User.create(validInput);
    await expect(
      user.verifyPassword(validInput.password + 'abc'),
    ).resolves.toBeFalsy();
  });
});
