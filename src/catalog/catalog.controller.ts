import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { CreateCatalogItemDto } from './dto/create-catalog-item.dto';
import { UpdateCatalogItemDto } from './dto/update-catalog-item.dto';

@ApiTags('Catalog')
@Controller('catalog')
// @UseGuards(AuthGuard('jwt')) // Placeholder for future auth guard
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new catalog item' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Catalog item created successfully.' /* type: CatalogItemDto */ })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request (e.g., validation error).' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  async create(@Body() createCatalogItemDto: CreateCatalogItemDto) {
    return this.catalogService.create(createCatalogItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all catalog items' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of catalog items.' /* type: [CatalogItemDto] */ })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  async findAll() {
    return this.catalogService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single catalog item by ID' })
  @ApiParam({ name: 'id', description: 'Catalog Item ID (UUID)', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Catalog item details.' /* type: CatalogItemDto */ })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Catalog item not found.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  async findOne(@Param('id') id: string) {
    return this.catalogService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a catalog item by ID' })
  @ApiParam({ name: 'id', description: 'Catalog Item ID (UUID)', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Catalog item updated successfully.' /* type: CatalogItemDto */ })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Catalog item not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request (e.g., validation error).' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  async update(@Param('id') id: string, @Body() updateCatalogItemDto: UpdateCatalogItemDto) {
    return this.catalogService.update(id, updateCatalogItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a catalog item by ID' })
  @ApiParam({ name: 'id', description: 'Catalog Item ID (UUID)', type: String })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Catalog item deleted successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Catalog item not found.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  async remove(@Param('id') id: string) {
    await this.catalogService.remove(id);
  }
}
