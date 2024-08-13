# Task Management API

## Overview
This project is a Task Management API built using Node.js, Express.js, and MongoDB. The API allows users to register, log in, and manage tasks, including creating, updating, retrieving, searching, filtering, and deleting tasks. The application is containerized using Docker and can be easily deployed with Docker Compose.

## Features
- **User Authentication:** Users can register and log in to the system. JWT tokens are used for authentication.
- **Task Management:** Users can create, retrieve, update, search, filter, and delete tasks.
- **Validation:** Input data is validated using `zod` to ensure the integrity of the data.
- **Logging:** Application logs are managed using `winston`, and HTTP request logs are handled using `morgan`.
- **Error Handling:** Centralized error handling for the application with custom error messages.
- **Environment Configuration:** The application uses environment variables to manage configuration settings.
- **Testing:** The application is tested using Jest, with separate tests for the authentication and task management functionalities.
- **Dockerization:** The application and its MongoDB database are containerized for easy deployment.

## Project Structure
- `src/config/`: Contains configuration files for database connection, logging, and request logging.
- `src/controllers/`: Contains controller classes that handle incoming requests and return responses.
- `src/enums/`: Contains enums for task statuses and priorities.
- `src/interfaces/`: Contains TypeScript interfaces for defining the shape of data models.
- `src/middlewares/`: Contains middleware for authentication.
- `src/models/`: Contains Mongoose models for interacting with the MongoDB database.
- `src/routes/`: Contains route definitions for authentication and task management.
- `src/services/`: Contains service classes that handle business logic.
- `src/types/`: Contains TypeScript definitions for extending Express.js interfaces.
- `src/utils/`: Contains utility classes for error handling.
- `src/validations/`: Contains validation schemas for user and task inputs.
- `test/`: Contains Jest test files for authentication and task management.
- `docker-compose.yaml`: Docker Compose file for setting up the application and MongoDB in containers.

## Installation

### Prerequisites
- Node.js (version 16 or higher)
- Docker (version 20 or higher)
- Docker Compose (version 1.29 or higher)
- Yarn

### Clone the Repository
```bash
git clone https://github.com/Braineanear/task-management-api
cd task-management-api
```

### Install Dependencies
```bash
yarn
```

### Environment Variables
Create a `.env` file in the root directory and add the following variables:

```plaintext
PORT=8080
MONGODB_URL=mongodb://localhost:27017/task-management
APP_ENV=development
JWT_SECRET=your_jwt_secret_key
```

### Run the Application

#### Using Node.js
To run the application locally using Node.js:

```bash
yarn run start:dev
```

#### Using Docker Compose
To run the application using Docker Compose:

```bash
docker-compose up -d
```

This command will build the application Docker image and start the application along with a MongoDB instance.

### Run Tests
To run the tests using Jest:

```bash
yarn run test
```

## API Endpoints

### Authentication Routes
- **POST `/auth/register`**: Register a new user.
- **POST `/auth/login`**: Login an existing user and receive a JWT token.

### Task Routes
- **POST `/tasks`**: Create a new task (Authentication required).
- **GET `/tasks`**: Get all tasks for the authenticated user (Authentication required).
- **GET `/tasks/:id`**: Get a specific task by ID (Authentication required).
- **PUT `/tasks/:id`**: Update a specific task by ID (Authentication required).
- **DELETE `/tasks/:id`**: Delete a specific task by ID (Authentication required).
- **GET `/tasks/search`**: Search tasks by title (Authentication required).
- **GET `/tasks/filter`**: Filter tasks by status and priority (Authentication required).

## API Documentation

This project uses Swagger to document the API endpoints. You can view the API documentation in a user-friendly interface by navigating to the following URL after starting the application:

- [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

Swagger provides detailed information about each API endpoint, including request parameters, response types, and authentication requirements.

## Error Handling
The application has centralized error handling using custom error classes. Errors are captured and returned with appropriate HTTP status codes and messages.

### Development Mode
In development mode, error stacks are included in the response for easier debugging.

### Production Mode
In production mode, only essential error information is provided to the client, while detailed errors are logged.

## Logging
- **Winston**: Used for logging application events such as database connections, errors, and informational messages.
- **Morgan**: Used for logging HTTP requests. Different formats are used for successful and error responses.

## Validation
All incoming data is validated using `zod` schemas to ensure correctness and to avoid invalid data entering the system.

## Security
- **JWT**: JSON Web Tokens are used for securing endpoints, ensuring that only authenticated users can access their data.
- **Password Hashing**: User passwords are hashed using `bcrypt` before being stored in the database.
