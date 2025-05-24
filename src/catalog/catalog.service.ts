import { Injectable, OnModuleInit, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateCatalogItemDto } from './dto/create-catalog-item.dto';
import { UpdateCatalogItemDto } from './dto/update-catalog-item.dto';

@Injectable()
export class CatalogService implements OnModuleInit {
  private supabaseClient: SupabaseClient;
  private readonly logger = new Logger(CatalogService.name);
  private readonly tableName = 'catalog_items';

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      this.logger.error('Supabase URL or Service Role Key is missing. Check your .env file.');
      throw new Error('Supabase URL or Service Role Key is missing for database operations.');
    }

    // Using service_role key for direct table access
    this.supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);
    this.logger.log('Supabase client initialized for CatalogService (using service_role for table access).');
  }

  async create(createCatalogItemDto: CreateCatalogItemDto) {
    this.logger.log(`Creating new catalog item: ${createCatalogItemDto.name}`);
    const { data, error } = await this.supabaseClient
      .from(this.tableName)
      .insert([createCatalogItemDto]) // Supabase expects an array for insert
      .select()
      .single(); // Assuming you want to return the created item

    if (error) {
      this.logger.error(`Error creating catalog item ${createCatalogItemDto.name}:`, error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    this.logger.log(`Catalog item ${data.name} (ID: ${data.id}) created successfully.`);
    return data;
  }

  async findAll() {
    this.logger.log('Fetching all catalog items');
    const { data, error } = await this.supabaseClient
      .from(this.tableName)
      .select('*');

    if (error) {
      this.logger.error('Error fetching all catalog items:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return data;
  }

  async findOne(id: string) {
    this.logger.log(`Fetching catalog item by ID: ${id}`);
    const { data, error } = await this.supabaseClient
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single(); // .single() will error if 0 or more than 1 row is found

    if (error) {
      this.logger.error(`Error fetching catalog item ${id}:`, error.message);
      if (error.code === 'PGRST116') { // PGRST116: "The result contains 0 rows"
        throw new HttpException(`Catalog item with ID ${id} not found.`, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    // No need to check if (!data) because .single() handles it.
    return data;
  }

  async update(id: string, updateCatalogItemDto: UpdateCatalogItemDto) {
    this.logger.log(`Updating catalog item ID: ${id}`);
    if (Object.keys(updateCatalogItemDto).length === 0) {
        this.logger.warn(`Update called for ID ${id} with no data. Returning current item.`);
        return this.findOne(id); // Or throw a BadRequestException
    }
    const { data, error } = await this.supabaseClient
      .from(this.tableName)
      .update(updateCatalogItemDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.logger.error(`Error updating catalog item ${id}:`, error.message);
      if (error.code === 'PGRST116') { // PGRST116: "The result contains 0 rows" (item to update not found)
        throw new HttpException(`Catalog item with ID ${id} not found for update.`, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    this.logger.log(`Catalog item ${id} updated successfully.`);
    return data;
  }

  async remove(id: string) {
    this.logger.log(`Deleting catalog item ID: ${id}`);
    // First, check if the item exists to provide a better error message
    const itemExists = await this.findOne(id); // This will throw 404 if not found

    const { error } = await this.supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      this.logger.error(`Error deleting catalog item ${id}:`, error.message);
      // The findOne check should ideally prevent "not found" errors here,
      // but defensive coding is good.
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    this.logger.log(`Catalog item ${id} deleted successfully.`);
    // Standard practice is to return a 204 No Content for DELETE.
    // The controller will handle this.
    return { message: `Catalog item with ID ${id} deleted successfully.` };
  }
}
