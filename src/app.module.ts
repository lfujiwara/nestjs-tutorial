import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
