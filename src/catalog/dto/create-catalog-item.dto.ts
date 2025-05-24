import { IsNotEmpty, IsString, IsNumber, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCatalogItemDto {
  @ApiProperty({ description: 'Name of the catalog item', example: 'Laptop Pro' })
  @IsNotEmpty({ message: 'Name should not be empty.' })
  @IsString({ message: 'Name must be a string.' })
  name: string;

  @ApiPropertyOptional({ description: 'Optional description of the item', example: 'High-performance laptop for professionals' })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @ApiProperty({ description: 'Price of the item', example: 1200.99 })
  @IsNotEmpty({ message: 'Price should not be empty.' })
  @IsNumber({}, { message: 'Price must be a number.' })
  @Min(0, { message: 'Price cannot be negative.' })
  price: number;

  @ApiProperty({ description: 'Available stock quantity', example: 50 })
  @IsNotEmpty({ message: 'Stock quantity should not be empty.' })
  @IsInt({ message: 'Stock quantity must be an integer.' })
  @Min(0, { message: 'Stock quantity cannot be negative.' })
  stock_quantity: number;
}
