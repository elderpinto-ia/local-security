import { Injectable, OnModuleInit, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient, UserAttributes } from '@supabase/supabase-js';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  private supabaseAdmin: SupabaseClient;
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      this.logger.error('Supabase URL or Service Role Key is missing. Check your .env file.');
      throw new Error('Supabase URL or Service Role Key is missing for admin operations.');
    }

    this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    this.logger.log('Supabase admin client initialized for UsersService.');
  }

  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Admin creating user: ${createUserDto.email}`);
    const { email, password, full_name } = createUserDto;

    const userAttributes: UserAttributes = {
      email,
      password,
      email_confirm: true, // Auto-confirm email as this is an admin action
    };

    if (full_name) {
      userAttributes.user_metadata = { full_name };
    }
    
    const { data, error } = await this.supabaseAdmin.auth.admin.createUser(userAttributes);

    if (error) {
      this.logger.error(`Error creating user ${email}:`, error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
    this.logger.log(`User ${email} created successfully by admin: ${data.user.id}`);
    return data.user;
  }

  async findAll() {
    this.logger.log('Fetching all users (admin operation)');
    // Note: listUsers has pagination, by default 50 users per page.
    // You might need to handle pagination for large user bases.
    const { data: { users }, error } = await this.supabaseAdmin.auth.admin.listUsers();

    if (error) {
      this.logger.error('Error fetching all users:', error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return users;
  }

  async findOne(id: string) {
    this.logger.log(`Fetching user by ID: ${id} (admin operation)`);
    const { data: { user } , error } = await this.supabaseAdmin.auth.admin.getUserById(id);

    if (error) {
      this.logger.error(`Error fetching user ${id}:`, error.message);
      if (error.status === 404 || error.message.toLowerCase().includes('not found')) {
        throw new HttpException(`User with ID ${id} not found.`, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!user) { // Double check if user is null even without an error
        throw new HttpException(`User with ID ${id} not found.`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`Admin updating user ID: ${id}`);
    const { email, full_name, is_active } = updateUserDto;

    const attributesToUpdate: UserAttributes = {};
    if (email) attributesToUpdate.email = email;
    if (full_name) attributesToUpdate.user_metadata = { ...attributesToUpdate.user_metadata, full_name };
    
    // Handling is_active: Supabase doesn't have a direct 'is_active' on auth.users.
    // This usually means banning/unbanning.
    // If `is_active === false`, we can ban the user.
    // If `is_active === true`, we might unban.
    // `ban_duration` of 'none' unbans. 'infinite' bans.
    if (is_active === false) {
        attributesToUpdate.ban_duration = 'infinite'; 
        this.logger.log(`Banning user ${id}`);
    } else if (is_active === true) {
        // Check current status before unbanning might be good, but for now, just set to none
        attributesToUpdate.ban_duration = 'none';
        this.logger.log(`Attempting to unban user ${id}`);
    }

    if (Object.keys(attributesToUpdate).length === 0) {
      this.logger.log(`No attributes provided to update for user ${id}.`);
      // Optionally, fetch and return the user as is, or return a specific message.
      return this.findOne(id); 
    }

    const { data: { user }, error } = await this.supabaseAdmin.auth.admin.updateUserById(id, attributesToUpdate);

    if (error) {
      this.logger.error(`Error updating user ${id}:`, error.message);
       if (error.status === 404 || error.message.toLowerCase().includes('not found')) {
        throw new HttpException(`User with ID ${id} not found for update.`, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
    this.logger.log(`User ${id} updated successfully by admin.`);
    return user;
  }

  async remove(id: string) {
    this.logger.log(`Admin deleting user ID: ${id}`);
    // Supabase deleteUser returns { data: null, error: null } on success for some versions
    // For others it might return the user object that was deleted.
    // Let's check response or rely on absence of error.
    const { data, error } = await this.supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      this.logger.error(`Error deleting user ${id}:`, error.message);
      if (error.status === 404 || error.message.toLowerCase().includes('not found')) {
        throw new HttpException(`User with ID ${id} not found for deletion.`, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
    this.logger.log(`User ${id} deleted successfully by admin.`);
    // Standard practice is to return a 204 No Content, so returning nothing or a success message.
    return { message: `User with ID ${id} deleted successfully.`, data };
  }
}
