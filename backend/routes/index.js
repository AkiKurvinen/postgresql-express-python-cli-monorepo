const express = require('express');
const router = express.Router();

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import sub-routes
const statusRoute = require('./status');
const authRoute = require('./auth');
const userRoutes = require('./user');

// Swagger configuration

const path = require('path');
const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Test API',
			version: '1.0.0',
		},
		servers: [
			{
				url: '/api/v1/',
				description: 'Base API path'
			}
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT'
				}
			}
		}
	},
	apis: [
		path.join(__dirname, 'auth.js'),
		path.join(__dirname, 'user.js'),
		path.join(__dirname, 'health.js'),
		path.join(__filename)
	],
};
const specs = swaggerJsdoc(swaggerOptions);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
router.use(express.json());

// Mount sub-routes
router.use('/status', statusRoute);
router.use('/', userRoutes);
router.use('/', authRoute);

// Root route
router.get('/', (req, res) => {
	res.json({ status: 'OK', message: 'Server is running' });
});

module.exports = router;
