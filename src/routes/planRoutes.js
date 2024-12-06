// import express from 'express';
// import { PlanController } from '../controllers/planController.js';
// import { authenticateToken } from '../middleware/authMiddleware.js';
// import createValidateSchemaMiddleware from '../middleware/validateSchema.js';

// const router = express.Router();

// // Initialize validation middleware
// let schemaValidator;
// createValidateSchemaMiddleware().then(validator => {
//     schemaValidator = validator;
// }).catch(error => {
//     console.error('Failed to initialize schema validator:', error);
// });

// const validateMiddleware = (req, res, next) => {
//     if (!schemaValidator) {
//         return res.status(503).json({ 
//             error: 'Service unavailable',
//             message: 'Schema validation not ready'
//         });
//     }
//     schemaValidator(req, res, next);
// };

// // Health check endpoint
// router.get('/health', async (req, res) => {
//     try {
//         const services = req.services;
//         const health = {
//             status: 'ok',
//             timestamp: new Date().toISOString(),
//             services: {}
//         };

//         // Check Redis
//         if (services.redisClient) {
//             try {
//                 await services.redisClient.ping();
//                 health.services.redis = 'connected';
//             } catch (e) {
//                 health.services.redis = 'disconnected';
//             }
//         }

//         // Check Elasticsearch
//         if (services.esService) {
//             try {
//                 await services.esService.esClient.ping();
//                 health.services.elasticsearch = 'connected';
//             } catch (e) {
//                 health.services.elasticsearch = 'disconnected';
//             }
//         }

//         // Check RabbitMQ
//         if (services.mqService) {
//             try {
//                 await services.mqService.channel.checkQueue('plan-created');
//                 health.services.rabbitmq = 'connected';
//             } catch (e) {
//                 health.services.rabbitmq = 'disconnected';
//             }
//         }

//         // Check Schema Validator
//         health.services.schemaValidator = schemaValidator ? 'initialized' : 'not initialized';

//         const allServicesHealthy = Object.values(health.services)
//             .every(status => ['connected', 'initialized'].includes(status));

//         health.status = allServicesHealthy ? 'healthy' : 'degraded';

//         const statusCode = allServicesHealthy ? 200 : 503;
//         res.status(statusCode).json(health);
//     } catch (error) {
//         console.error('Health check error:', error);
//         res.status(503).json({
//             status: 'error',
//             message: error.message,
//             timestamp: new Date().toISOString()
//         });
//     }
// });

// // Protected routes with authentication and validation
// // Search endpoint - must be before /:id to avoid path conflicts
// router.get('/search/:serviceName', authenticateToken, PlanController.searchPlansByService);

// // CRUD endpoints
// router.post('/', authenticateToken, validateMiddleware, PlanController.createPlan);
// router.get('/:id', authenticateToken, PlanController.getPlan);
// router.put('/:id', authenticateToken, validateMiddleware, PlanController.updatePlan);
// router.patch('/:id', authenticateToken, validateMiddleware, PlanController.updatePlan);
// router.delete('/:id', authenticateToken, PlanController.deletePlan);

// // Error handling middleware
// router.use((err, req, res, next) => {
//     console.error('Route Error:', {
//         message: err.message,
//         stack: err.stack,
//         timestamp: new Date().toISOString()
//     });

//     // Handle specific error types
//     if (err.name === 'ValidationError') {
//         return res.status(400).json({
//             error: 'Validation Error',
//             message: err.message,
//             details: err.details
//         });
//     }

//     if (err.name === 'UnauthorizedError') {
//         return res.status(401).json({
//             error: 'Unauthorized',
//             message: err.message
//         });
//     }

//     // Default error response
//     res.status(err.status || 500).json({
//         error: err.name || 'Internal Server Error',
//         message: err.message,
//         ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//     });
// });

// export default router;

import express from 'express';
import { PlanController } from '../controllers/planController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import createValidateSchemaMiddleware from '../middleware/validateSchema.js';

const router = express.Router();

// Health check endpoint
router.get('/health', async (req, res) => {
    try {
        const services = req.services;
        const health = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            services: {}
        };

        // Check Redis
        if (services.redisClient) {
            try {
                await services.redisClient.ping();
                health.services.redis = 'connected';
            } catch (e) {
                health.services.redis = 'disconnected';
            }
        }

        // Check Elasticsearch
        if (services.esService) {
            try {
                await services.esService.esClient.ping();
                health.services.elasticsearch = 'connected';
            } catch (e) {
                health.services.elasticsearch = 'disconnected';
            }
        }

        // Check RabbitMQ
        if (services.mqService) {
            try {
                await services.mqService.channel.checkQueue('plan-created');
                health.services.rabbitmq = 'connected';
            } catch (e) {
                health.services.rabbitmq = 'disconnected';
            }
        }

        // Check Schema Validator
        health.services.schemaValidator = 'initialized';

        const allServicesHealthy = Object.values(health.services)
            .every(status => ['connected', 'initialized'].includes(status));

        health.status = allServicesHealthy ? 'healthy' : 'degraded';

        const statusCode = allServicesHealthy ? 200 : 503;
        res.status(statusCode).json(health);
    } catch (error) {
        console.error('Health check error:', error);
        res.status(503).json({
            status: 'error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Initialize validation middleware and wait for readiness
let schemaValidator;
(async () => {
    try {
        schemaValidator = await createValidateSchemaMiddleware();
        console.log('Schema validator initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize schema validator:', error);
        process.exit(1); // Terminate application if schema validation cannot be initialized
    }
})();

const validateMiddleware = (req, res, next) => {
    if (!schemaValidator) {
        return res.status(503).json({
            error: 'Service Unavailable',
            message: 'Schema validation not initialized'
        });
    }
    schemaValidator(req, res, next);
};

// Protected routes with authentication and validation
// Search endpoint - must be before /:id to avoid path conflicts
router.get('/search/:serviceName', authenticateToken, PlanController.searchPlansByService);

// CRUD endpoints
router.post('/', authenticateToken, validateMiddleware, PlanController.createPlan);
router.get('/:id', authenticateToken, PlanController.getPlan);
router.put('/:id', authenticateToken, validateMiddleware, PlanController.updatePlan);
router.patch('/:id', authenticateToken, validateMiddleware, PlanController.patchPlan);
router.delete('/:id', authenticateToken, PlanController.deletePlan);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error('Route Error:', {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
        route: req.originalUrl
    });

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message,
            details: err.details
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: err.message
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        error: err.name || 'Internal Server Error',
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

export default router;
