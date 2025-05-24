import { Controller, Get, Logger, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  private readonly logger = new Logger(DashboardController.name);

  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get dashboard summary data' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Dashboard summary data retrieved successfully.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  async getDashboardSummary() {
    this.logger.log('Received request for dashboard summary data.');
    // Error handling is already present from previous implementation
    return this.dashboardService.getSummaryData();
  }
}
