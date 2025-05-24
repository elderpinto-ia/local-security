import { Module } from '@nestjs/common';
import { AuthController } from '../auth.controller'; // CLI generated it in src/, not src/auth/
import { AuthService } from '../auth.service';   // CLI generated it in src/, not src/auth/
// ConfigModule is globally available, so no need to import here unless for specific non-global config

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
