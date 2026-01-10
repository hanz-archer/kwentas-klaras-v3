import swaggerJsdoc from 'swagger-jsdoc'
import { join } from 'path'
import '../docs/swagger/index'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Kwentas Klaras API',
    version: '1.0.0',
    description: 'API documentation for Kwentas Klaras Backend',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: process.env.APP_URL || 'http://localhost:3000',
      description: 'Development server',
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
  tags: [
    {
      name: 'Auth',
      description: 'Authentication endpoints',
    },
    {
      name: 'Users',
      description: 'User management endpoints',
    },
    {
      name: 'Projects',
      description: 'Project management endpoints',
    },
    {
      name: 'Additional Budgets',
      description: 'Additional budget management endpoints',
    },
    {
      name: 'Obligations',
      description: 'Obligation management endpoints',
    },
    {
      name: 'Disbursements',
      description: 'Disbursement management endpoints',
    },
    {
      name: 'Departments',
      description: 'Department management endpoints',
    },
    {
      name: 'Locations',
      description: 'Location management endpoints',
    },
    {
      name: 'Services',
      description: 'Service management endpoints',
    },
    {
      name: 'Remarks',
      description: 'Remarks management endpoints',
    },
  ],
}

const options: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  apis: [join(process.cwd(), 'server', 'docs', 'swagger', '*.ts')],
}

export const swaggerSpec = swaggerJsdoc(options)
