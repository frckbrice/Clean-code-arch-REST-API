'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const { dbconnection } = require('./interface-adapters/database-access/db-connection.js');
const errorHandler = require('./interface-adapters/middlewares/loggers/errorHandler.js');
const { logger, log } = require('./interface-adapters/middlewares/loggers/logger.js');
const createIndexFn = require('./interface-adapters/database-access/db-indexes.js');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 5000;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Clean Architecture REST API',
    version: '1.0.0',
    description:
      "REST API demonstrating Uncle Bob's Clean Architecture: testable, maintainable, and framework-agnostic business logic. See the **Schemas** section for all request/response models.",
    contact: {
      name: 'Avom Brice',
      email: 'bricefrkc@gmail.com',
    },
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Local server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      RegisterInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          username: { type: 'string', example: 'johndoe' },
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          password: { type: 'string', format: 'password', minLength: 8 },
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          role: { type: 'string', enum: ['user', 'admin'], default: 'user' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' },
          accessToken: { type: 'string', description: 'JWT access token' },
          refreshToken: { type: 'string', description: 'JWT refresh token' },
        },
      },
      ForgotPasswordInput: {
        type: 'object',
        required: ['email'],
        properties: { email: { type: 'string', format: 'email' } },
      },
      ResetPasswordInput: {
        type: 'object',
        required: ['token', 'newPassword'],
        properties: {
          token: { type: 'string', description: 'Password reset token from email' },
          newPassword: { type: 'string', format: 'password', minLength: 8 },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          code: { type: 'string' },
          statusCode: { type: 'integer' },
        },
      },
    },
  },
  security: [],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);

const app = express();

const cookieParser = require('cookie-parser');
const corsOptions = require('./interface-adapters/middlewares/config/corsOptions.Js');

dbconnection().then((db) => {
  log.info('database connected:', db.databaseName);
  createIndexFn();
});

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Register Swagger UI BEFORE any static or catch-all routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const mainRouter = require('./routes');

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

// Serve static assets (CSS, images) from public
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainRouter);

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'public', 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ msg: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use((req, res, next) => {
  const dntHeader = req.headers['dnt'];
  if (dntHeader === '1') {
    log.debug('User has DNT enabled');
  }
  next();
});

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    log.info('Server is running on port', PORT);
  });
}

module.exports = app;
