import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller'; // Path updated
import { DashboardService } from './dashboard.service';     // Path updated

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
