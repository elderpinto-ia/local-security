# Modern Backend API with NestJS and Supabase

This project is a backend application built with NestJS and TypeScript, integrated with Supabase for database and authentication.

## Features

*   **Authentication**: Secure user registration, login, and password recovery using Supabase Auth.
*   **User Management**: CRUD operations for managing users (requires admin privileges).
*   **Catalog Management**: CRUD operations for managing catalog items/products.
*   **Item Details**: Endpoint to fetch detailed information for a catalog item.
*   **Dashboard**: Placeholder endpoint for system summary.
*   **API Documentation**: Swagger (OpenAPI) documentation available at `/api-docs`.
*   **Configuration**: Environment variable based configuration using `.env` file.

## Prerequisites

*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   npm (comes with Node.js)
*   A [Supabase](https://supabase.com/) account and an active project.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    *   Create a `.env` file in the root of the project by copying the example file:
        ```bash
        cp .env.example .env
        ```
    *   Open the `.env` file and update it with your Supabase project credentials:
        *   `SUPABASE_URL`: Found in your Supabase project settings (API -> Project URL).
        *   `SUPABASE_ANON_KEY`: Found in your Supabase project settings (API -> Project API keys -> `anon` `public`).
        *   `SUPABASE_SERVICE_ROLE_KEY`: Found in your Supabase project settings (API -> Project API keys -> `service_role` `secret`).
    *   You can also set an optional `PORT` (defaults to 3000 if not set).

4.  **Database Setup (Important):**
    This application expects certain tables to exist in your Supabase database:
    *   **`catalog_items`**: Used by the Catalog module. A basic schema could be:
        *   `id` (uuid, primary key, auto-generated)
        *   `name` (text, not null)
        *   `description` (text)
        *   `price` (numeric, not null)
        *   `stock_quantity` (integer, default 0)
        *   `created_at` (timestamp with time zone, default now())
    *   User data is managed via Supabase Auth and interacts with the `auth.users` table. Ensure your Supabase project has authentication enabled.

    You will need to create the `catalog_items` table in your Supabase project's SQL editor if it doesn't exist.

## Running the Application

*   **Development mode (with auto-reloading):**
    ```bash
    npm run start:dev
    ```
*   **Production mode:**
    ```bash
    npm run build
    npm run start:prod
    ```

The application will typically be available at `http://localhost:3000` (or your configured `PORT`).

## API Documentation

Once the application is running, Swagger API documentation can be accessed at:
`http://localhost:3000/api-docs`

## Running Tests

To run the unit tests:
```bash
npm test
```
**Note:** There is a known issue with the Jest test runner configuration (`ts-jest` module not found) in the current version. The tests for `AuthModule` have been written but could not be verified. Further debugging of the Jest setup is required to execute them successfully.
