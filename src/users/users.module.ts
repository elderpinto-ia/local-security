import { Module } from '@nestjs/common';
import { UsersController } from './users.controller'; // Path updated
import { UsersService } from './users.service';     // Path updated

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Optional: export if other modules need this service
})
export class UsersModule {}
