import { IsString, IsNumber, IsInt, Min, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCatalogItemDto {
  @ApiPropertyOptional({ description: 'New name of the catalog item', example: 'Laptop Pro X' })
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  name?: string;

  @ApiPropertyOptional({ description: 'New description of the item', example: 'Even more powerful laptop' })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @ApiPropertyOptional({ description: 'New price of the item', example: 1299.99 })
  @IsOptional()
  @IsNumber({}, { message: 'Price must be a number.' })
  @Min(0, { message: 'Price cannot be negative.' })
  price?: number;

  @ApiPropertyOptional({ description: 'New stock quantity', example: 75 })
  @IsOptional()
  @IsInt({ message: 'Stock quantity must be an integer.' })
  @Min(0, { message: 'Stock quantity cannot be negative.' })
  stock_quantity?: number;
}
