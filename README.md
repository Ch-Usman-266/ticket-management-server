# Ticket Management Server

A basic ticket management system server built with Node.js, Express.js with Postgres and Sequelize ORM.

## Prerequisites

- Node.js version 14.0.0 or higher is required.

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/example/ticket-management-server.git

   ```

2. Install the dependencies:

   ```
   cd ticket-management-server
   npm install
   ```
# Environment Variables

To run the Ticket Management Server, you will need to set up the following environment variables in a `.env` file in the root directory of the project:

```
NODE_ENV = <your_node_env>
PORT = <your_desired_port_env>
JWT_SECRET = <your_generated_secret>

POSTGRES_USER = <your_db_user>
POSTGRES_PASSWORD = <your_db_password>
POSTGRES_DB_NAME = <your_db_name>
POSTGRES_HOST = <your_db_host>
```

Explanation of each environment variable:

- `NODE_ENV`: Specifies the environment in which the server will run. It is set to "development" in this case.
- `PORT`: The port number on which the server will listen for incoming requests.
- `JWT_SECRET`: The secret key used to sign and verify JSON Web Tokens (JWT) for authentication.
- `POSTGRES_USER`: The username for connecting to the PostgreSQL database.
- `POSTGRES_PASSWORD`: The password for connecting to the PostgreSQL database.
- `POSTGRES_DB_NAME`: The name of the PostgreSQL database used for development.
- `POSTGRES_HOST`: The hostname where the PostgreSQL database is running (in this case, it is set to `localhost`).

Please make sure to update these values accordingly based on your specific setup and configuration.

## Usage

To run the server in development mode using `nodemon`, execute:

```
npm run dev
```

To start the server in production mode, execute:

```
npm start
```

## API Routes

### Authentication

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/signin`: Sign in with existing credentials.

### Ticket Management

You need an access token to access ticket routes. Make sure to include the token in the `Authorization` header.

- `GET /api/tickets`: Get all tickets.
- `GET /api/tickets/:id`: Get a single ticket by ID.
- `POST /api/tickets`: Create a new ticket.
- `PATCH /api/tickets/:id`: Update a ticket by ID.
- `PATCH /api/tickets/:id/status`: Update the status of a ticket by ID.
- `DELETE /api/tickets/:id`: Delete a ticket by ID.

## Database Models

### User

Represents a user in the system.

#### Fields:

- `id` (UUID, primary key): The unique identifier for the user.
- `name` (String, required): The name of the user.
- `email` (String, required, unique): The email address of the user.
- `password` (String, required): The hashed password of the user.
- `role` (Enum, default: 'user'): The role of the user (admin or user).

### Ticket

Represents a ticket in the system.

#### Fields:

- `id` (UUID, primary key): The unique identifier for the ticket.
- `name` (String, required): The name associated with the ticket.
- `email` (String, required): The email address associated with the ticket.
- `description` (String, required): The description of the ticket.
- `status` (Enum, default: 'new'): The status of the ticket (new, in_progress, or resolved).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.