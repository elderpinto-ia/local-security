import { Controller, Get, Param, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DetailsService } from './details.service';

@ApiTags('Details')
@Controller('details')
export class DetailsController {
  private readonly logger = new Logger(DetailsController.name);

  constructor(private readonly detailsService: DetailsService) {}

  @Get('item/:id')
  @ApiOperation({ summary: 'Get details for a specific catalog item' })
  @ApiParam({ name: 'id', description: 'Catalog Item ID (UUID)', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Catalog item details.' /* type: CatalogItemDto (or similar from CatalogModule) */ })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Catalog item not found.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  async getItemDetails(@Param('id') id: string) {
    this.logger.log(`Received request for item details: ID ${id}`);
    // Error handling is already present from previous implementation,
    // which re-throws HttpExceptions or creates a new one.
    return this.detailsService.findItemDetails(id);
  }
}
