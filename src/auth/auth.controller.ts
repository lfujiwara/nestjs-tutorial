import { Body, Controller, Post } from '@nestjs/common';
import { RegisterNewUserService } from './services/register-new-user/register-new-user.service';

@Controller('auth')
export class AuthController {
  constructor(private registerNewUser: RegisterNewUserService) {}

  @Post('users')
  async registerNewUserRoute(@Body() body) {
    const res = await this.registerNewUser.execute(body);
    return {
      id: res.id,
      email: res.email,
      username: res.username,
    };
  }
}
