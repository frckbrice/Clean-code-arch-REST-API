![Clean Architecture Diagram](./public/images/clean-architecture.png)

# Digital Market Place API

A Node.js REST API for a digital marketplace, structured according to Uncle Bob's Clean Architecture principles. This project demonstrates separation of concerns, testability, and scalability by organizing code into distinct layers: Enterprise Business Rules, Application Business Rules, Interface Adapters, and Frameworks & Drivers.

## Table of Contents

- [Introduction](#introduction)
- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Linting & Formatting](#linting--formatting)
- [Docker & Docker Compose](#docker--docker-compose)
- [CI/CD Workflow](#cicd-workflow)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Introduction

This backend API allows users to register, authenticate, and interact with products, blogs, and ratings. It is designed for maintainability and extensibility, following Clean Architecture best practices.

## Architecture Overview

The project is organized into the following layers:

- **Enterprise Business Rules**: Core business logic and domain models (`enterprise-business-rules/`).
- **Application Business Rules**: Use cases and application-specific logic (`application-business-rules/`).
- **Interface Adapters**: Controllers, database access, adapters, and middlewares (`interface-adapters/`).
- **Frameworks & Drivers**: Express.js, MongoDB, and other external libraries.

```
enterprise-business-rules/
  entities/           # Domain models (User, Product, Rating, Blog)
  validate-models/    # Validation logic for domain models
application-business-rules/
  use-cases/          # Application use cases (products, user)
interface-adapters/
  controllers/        # Route controllers for products, users
  database-access/    # DB connection and data access logic
  adapter/            # Adapters (e.g., request/response)
  middlewares/        # Auth, logging, error handling
routes/               # Express route definitions
public/               # Static files and HTML views
```

## Features

- User registration and authentication (JWT)
- Product CRUD operations
- Blog and rating management
- Role-based access control (admin, blocked users)
- Input validation and error handling
- Modular, testable codebase

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd Clean-code-arch-REST-API
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Create a `.env` file in the root with your environment variables (see `.env.example` if available):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/your-db
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   yarn dev
   # or
   yarn start
   ```

The server will run at [http://localhost:5000](http://localhost:5000).

## Project Structure

- `index.js` - Main entry point, sets up Express, routes, and middleware
- `routes/` - Express route definitions for products, users, blogs
- `interface-adapters/` - Controllers, DB access, adapters, and middleware
- `application-business-rules/` - Use cases for products and users
- `enterprise-business-rules/` - Domain models and validation logic
- `public/` - Static HTML views (landing page, 404)

## API Endpoints

### Products

- `POST   /products/` - Create a new product
- `GET    /products/` - Get all products
- `GET    /products/:productId` - Get a product by ID
- `PUT    /products/:productId` - Update a product
- `DELETE /products/:productId` - Delete a product
- `POST   /products/:productId/:userId/rating` - Rate a product

### Users & Auth

- `POST   /users/register` - Register a new user
- `POST   /users/login` - User login
- `GET    /users/profile` - Get user profile (auth required)

### Blogs

- `GET    /blogs/` - Get all blogs
- `POST   /blogs/` - Create a new blog

> More endpoints and details can be found in the route files under `routes/`.

## Testing

- Tests are written using [Jest](https://jestjs.io/) and [Supertest](https://github.com/visionmedia/supertest).
- To run all tests:
  ```bash
  yarn test
  ```
- Test files are located in the `tests/` directory.

## Linting & Formatting

- Lint your code:
  ```bash
  yarn lint
  ```
- Format your code:
  ```bash
  yarn format
  ```
- Prettier and ESLint are enforced on pre-push via Husky and lint-staged.

## Docker & Docker Compose

- Build and run the app with MongoDB using Docker Compose:
  ```bash
  docker-compose up --build
  ```
- The app will be available at [http://localhost:5000](http://localhost:5000).
- The MongoDB service runs at `mongodb://localhost:27017/cleanarchdb`.
- To stop and remove containers, networks, and volumes:
  ```bash
  docker-compose down -v
  ```

## CI/CD Workflow

- GitHub Actions workflow is set up in `.github/workflows/ci-cd.yml`.
- On push to `main`, the workflow:
  - Installs dependencies
  - Lints and formats code
  - Runs tests
  - Builds a Docker image
  - Pushes the image to Docker Hub (update credentials and repo in workflow and GitHub secrets)

## Troubleshooting

- Common issues and solutions are documented in [troubleshooting.md](./troubleshooting.md).
- Please add new issues and solutions as you encounter them.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
