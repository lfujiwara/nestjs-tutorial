import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthExceptionFilter } from './services/register-new-user/register-new-user-exceptions.filter';
import { RegisterNewUserService } from './services/register-new-user/register-new-user.service';

@Controller('auth')
export class AuthController {
  constructor(private registerNewUser: RegisterNewUserService) {}

  @Post('users')
  @UseFilters(AuthExceptionFilter)
  async registerNewUserRoute(@Body() body) {
    const res = await this.registerNewUser.execute(body);
    return {
      id: res.id,
      email: res.email,
      username: res.username,
    };
  }
}
