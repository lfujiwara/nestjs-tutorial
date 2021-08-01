import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { UserRepository } from './repositories/user.repository';

@Module({
  providers: [Pool, UserRepository],
  exports: [UserRepository],
})
export class DataModule {}
