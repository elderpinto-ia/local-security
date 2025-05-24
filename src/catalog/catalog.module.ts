import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller'; // Path updated
import { CatalogService } from './catalog.service';     // Path updated

@Module({
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService], // Optional: export if other modules need this service
})
export class CatalogModule {}
