const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const { dbconnection } = require('./interface-adapters/database-access/db-connection.js');
const errorHandler = require('./interface-adapters/middlewares/loggers/errorHandler.js');
const { logger } = require('./interface-adapters/middlewares/loggers/logger.js');
const createIndexFn = require('./interface-adapters/database-access/db-indexes.js');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 5000;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Clean Architecture REST API',
    version: '1.0.0',
    description: 'API documentation for the Clean Architecture Node.js REST API',
    contact: {
      name: 'Avom Brice',
      email: 'bricefrkc@gmail.com',
    },
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Local server API documentation',
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
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: [
    './routes/*.js',
  ],
};
const swaggerSpec = swaggerJSDoc(options);

const app = express();

var cookieParser = require('cookie-parser');
const corsOptions = require('./interface-adapters/middlewares/config/corsOptions.Js');

// database connection call function
dbconnection().then((db) => {
  console.log('database connected: ', db.databaseName);
  createIndexFn();
});

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Register Swagger UI BEFORE any static or catch-all routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use the new single entry point for all routes
const mainRouter = require('./routes');

// Only serve index.html for the root path
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.use('/', mainRouter);


//for no specified endpoint that is not found. this must after all the middlewares
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
  // Access DNT header (if present)
  const dntHeader = req.headers['dnt'];
  if (dntHeader === '1') {
    console.log('User has DNT enabled');
    // TODO: Implement logic to handle DNT preference (e.g., disable tracking features)
  }
  // Pass control to the next middleware or route handler
  next();
});

app.use(errorHandler);

// Only call app.listen() if not in test
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
