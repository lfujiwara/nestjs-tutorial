import * as Joi from 'joi';
import * as bcrypt from 'bcryptjs';

export class User {
  id?: number | string;
  username: string;
  email: string;
  passwordHash: string;

  static schema = Joi.object<User>({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).alphanum().required(),
    passwordHash: Joi.string(),
  }).unknown(true);

  validate() {
    Joi.assert(this, User.schema);
  }

  static async create({ username, email, password }) {
    const user = new User({
      username,
      email,
      passwordHash: await bcrypt.hash(password, await bcrypt.genSalt()),
    });
    Joi.assert(password, Joi.string().min(8).max(64).required());
    user.validate();
    return user;
  }

  constructor({ username, email, passwordHash }) {
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
  }

  verifyPassword(password: string) {
    return bcrypt.compare(password, this.passwordHash);
  }
}
