import { Module } from '@nestjs/common';
import { DetailsController } from './details.controller'; // Path updated
import { DetailsService } from './details.service';     // Path updated
import { CatalogModule } from '../catalog/catalog.module'; // Import CatalogModule

@Module({
  imports: [CatalogModule], // Add CatalogModule to imports
  controllers: [DetailsController],
  providers: [DetailsService],
  exports: [DetailsService],
})
export class DetailsModule {}
