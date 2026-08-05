// src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PropertyHub API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:8000' }],
  },
  apis: ['./src/routes/*.js'], // Ye aapke routes folder ko scan karega
};

module.exports = swaggerJsdoc(options);