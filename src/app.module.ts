import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { UsersModule } from './users/users.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CatalogModule } from './catalog/catalog.module';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { DetailsModule } from './details/details.module';
// Controllers and Services for Dashboard, Users, Catalog, Details
// should not be imported or declared here directly. They belong to their respective modules.

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
    AuthModule,
    DashboardModule,
    UsersModule,
    CatalogModule,
    DetailsModule,
  ],
  controllers: [AppController], // Only AppController should be here
  providers: [AppService],     // Only AppService should be here
})
export class AppModule {}
