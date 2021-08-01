import { Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { User } from '../../core/user';

export class UserRepository {
  constructor(@Inject(Pool) private conn: Pool) {}

  async isEmailRegistered(email: string) {
    const result = await this.conn.query(
      `
      SELECT COUNT(1) FROM users WHERE email = $1;
    `,
      [email],
    );

    return Number(result.rows[0].count) > 0;
  }

  async isUsernameRegistered(username: string) {
    const result = await this.conn.query(
      `
      SELECT COUNT(1) FROM users WHERE username = $1;
    `,
      [username],
    );

    return Number(result.rows[0].count) > 0;
  }

  async registerNewUser(user: User) {
    const result = await this.conn.query(
      `
      INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, password_hash
    `,
      [user.username, user.email, user.passwordHash],
    );

    user.id = Number(result.rows[0].id);
  }
}
