import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { CatalogService } from '../catalog/catalog.service'; // Adjusted path

@Injectable()
export class DetailsService {
  private readonly logger = new Logger(DetailsService.name);

  constructor(private readonly catalogService: CatalogService) {}

  async findItemDetails(itemId: string) {
    this.logger.log(`Fetching details for catalog item ID: ${itemId}`);
    try {
      // This directly uses the CatalogService's findOne method.
      // Future enhancements could involve aggregating more data here.
      const itemDetails = await this.catalogService.findOne(itemId);
      if (!itemDetails) {
        // This case should ideally be handled by catalogService.findOne() throwing an error.
        // But as a safeguard:
        throw new HttpException(`Item details not found for ID: ${itemId}`, HttpStatus.NOT_FOUND);
      }
      return itemDetails;
    } catch (error) {
      this.logger.error(`Error fetching details for item ${itemId}: ${error.message}`, error.stack);
      // Re-throw the error, or handle it specifically if DetailsService needs to.
      // If the error is already an HttpException from CatalogService, it will be re-thrown as is.
      if (error instanceof HttpException) {
        throw error;
      }
      // For unexpected errors:
      throw new HttpException('Error retrieving item details.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
