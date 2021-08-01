import { AuthController } from './auth.controller';
import { DataModule } from '../data/data.module';
import { Module } from '@nestjs/common';
import { RegisterNewUserService } from './services/register-new-user/register-new-user.service';
import { UserRepository } from '../data/repositories/user.repository';

@Module({
  imports: [DataModule],
  providers: [
    RegisterNewUserService,
    {
      provide: 'RegisterNewUserService.emailIsAlreadyRegistered',
      useFactory: (repo: UserRepository) => repo.isEmailRegistered.bind(repo),
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
  ],
  controllers: [AuthController],
})
export class AuthModule {}
