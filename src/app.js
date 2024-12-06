// import express from 'express';
// import dotenv from 'dotenv';
// import Redis from 'ioredis';
// import cors from 'cors';
// import cookieSession from 'cookie-session';
// import planRoutes from './routes/planRoutes.js';
// import authRoutes from './routes/authRoutes.js';
// import { authenticateToken } from './middleware/authMiddleware.js';

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;

// // Redis client setup
// const redisClient = new Redis(process.env.REDIS_URL);

// redisClient.on('error', (err) => console.log('Redis Client Error', err));
// redisClient.on('connect', () => console.log('Connected to Redis'));

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(
//   cookieSession({
//     name: 'session',
//     keys: [process.env.COOKIE_SESSION_SECRET],
//     maxAge: 24 * 60 * 60 * 1000, // 24 hours
//   })
// );

// // Make redisClient available to all routes
// app.use((req, res, next) => {
//   req.redisClient = redisClient;
//   next();
// });

// // Public authentication routes
// app.use('/auth', authRoutes);

// // Protected routes
// app.use('/api/plans', authenticateToken, planRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(500).json({
//     error: 'Internal Server Error',
//     message: err.message
//   });
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
//   console.log('Auth endpoints:');
//   console.log('  - GET /auth/google/login');
//   console.log('  - GET /auth/google/callback');
//   console.log('Protected endpoints:');
//   console.log('  - POST   /api/plans');
//   console.log('  - GET    /api/plans/:id');
//   console.log('  - PATCH  /api/plans/:id');
//   console.log('  - DELETE /api/plans/:id');
// });

// // Handle server shutdown
// process.on('SIGTERM', async () => {
//   console.log('Shutting down server...');
//   await redisClient.quit();
//   process.exit(0);
// });

// export default app;
// app.js


// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import Redis from 'ioredis';
// import { Client } from '@elastic/elasticsearch';
// import amqp from 'amqplib';
// import planRoutes from './routes/planRoutes.js';
// import { ElasticSearchService } from './services/elasticSearchService.js';
// import { MessageQueueService } from './services/messageQueue.service.js';
// import { PlanService } from './services/planService.js';
// import { IndexingWorker } from './workers/indexingWorker.js';

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;

// // Service clients
// let redisClient;
// let esClient;
// let mqConnection;
// let mqChannel;
// let esService;
// let mqService;
// let planService;
// let worker;

// // Initialize all services
// const initializeServices = async () => {
//     try {
//         // Initialize Redis
//         redisClient = new Redis({
//             host: process.env.REDIS_HOST || 'localhost',
//             port: process.env.REDIS_PORT || 6379
//         });
//         console.log('Redis initialized');

//         // Initialize Elasticsearch
//         esClient = new Client({
//             node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
//         });
//         console.log('Elasticsearch client initialized');

//         // Initialize RabbitMQ
//         mqConnection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
//         mqChannel = await mqConnection.createChannel();
//         console.log('RabbitMQ connected');

//         // Initialize services
//         esService = new ElasticSearchService(esClient);
//         await esService.initializeIndex();
//         console.log('Elasticsearch index initialized');

//         mqService = new MessageQueueService(mqChannel);
//         await mqService.initialize();
//         console.log('Message queue service initialized');

//         planService = new PlanService(redisClient, esService, mqService);
//         console.log('Plan service initialized');

//         // Initialize and start the indexing worker
//         worker = new IndexingWorker(mqService, esService);
//         await worker.start();
//         console.log('Indexing worker started');

//     } catch (error) {
//         console.error('Service initialization error:', error);
//         throw error;
//     }
// };

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Attach services to request object
// app.use((req, res, next) => {
//     req.services = {
//         redisClient,
//         esService,
//         mqService,
//         planService
//     };
//     next();
// });

// // Routes
// app.use('/api/plans', planRoutes);

// // Error handling
// app.use((err, req, res, next) => {
//     console.error('Error:', err);
//     res.status(500).json({
//         error: 'Internal Server Error',
//         message: err.message
//     });
// });

// // Graceful shutdown handler
// const shutdown = async () => {
//     console.log('Shutting down server...');
//     try {
//         if (mqChannel) await mqChannel.close();
//         if (mqConnection) await mqConnection.close();
//         if (redisClient) await redisClient.quit();
//         process.exit(0);
//     } catch (error) {
//         console.error('Error during shutdown:', error);
//         process.exit(1);
//     }
// };

// // Handle shutdown signals
// process.on('SIGTERM', shutdown);
// process.on('SIGINT', shutdown);

// // Start server
// const startServer = async () => {
//     try {
//         await initializeServices();
        
//         app.listen(port, () => {
//             console.log(`Server running on port ${port}`);
//             console.log(`Health check: http://localhost:${port}/health`);
//             console.log('Available endpoints:');
//             console.log('  - POST   /api/plans');
//             console.log('  - GET    /api/plans/:id');
//             console.log('  - PUT    /api/plans/:id');
//             console.log('  - PATCH  /api/plans/:id');
//             console.log('  - DELETE /api/plans/:id');
//             console.log('  - GET    /api/plans/search/:serviceName');
//         });
//     } catch (error) {
//         console.error('Server startup error:', error);
//         process.exit(1);
//     }
// };

// // Add basic health check endpoint
// app.get('/health', (req, res) => {
//     res.json({
//         status: 'ok',
//         redis: redisClient?.status || 'not_connected',
//         elasticsearch: esClient?.ping() ? 'connected' : 'not_connected',
//         rabbitmq: mqChannel ? 'connected' : 'not_connected'
//     });
// });

// startServer();

// export default app;
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import Redis from 'ioredis';
// import { Client } from '@elastic/elasticsearch';
// import amqp from 'amqplib';
// import planRoutes from './routes/planRoutes.js';
// import { ElasticSearchService } from './services/elasticSearchService.js';
// import { MessageQueueService } from './services/messageQueue.service.js';
// import { PlanService } from './services/planService.js';
// import { IndexingWorker } from './workers/indexingWorker.js';

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;

// // Service clients
// let redisClient;
// let esClient;
// let mqConnection;
// let mqChannel;
// let esService;
// let mqService;
// let planService;
// let worker;

// // Initialize RabbitMQ with retry logic
// const initializeRabbitMQ = async () => {
//     const maxRetries = 5;
//     let retries = 0;

//     while (retries < maxRetries) {
//         try {
//             console.log('Attempting to connect to RabbitMQ...');
//             const connection = await amqp.connect({
//                 protocol: 'amqp',
//                 hostname: '127.0.0.1',
//                 port: 5672,
//                 username: 'vaishnavi',
//                 password: 'maggi123',
//                 vhost: '/'
//             });
            
//             const channel = await connection.createChannel();
            
//             // Simple queue setup
//             const queues = ['plan-created', 'plan-updated', 'plan-deleted'];
//             for (const queue of queues) {
//                 await channel.assertQueue(queue, {
//                     durable: true
//                 });
//             }

//             await channel.prefetch(1);
//             console.log('Successfully connected to RabbitMQ');
//             return { connection, channel };
//         } catch (error) {
//             retries++;
//             console.error(`Failed to connect to RabbitMQ (attempt ${retries}/${maxRetries}):`, error.message);
//             if (retries === maxRetries) {
//                 throw new Error(`Failed to connect to RabbitMQ after ${maxRetries} attempts: ${error.message}`);
//             }
//             // Wait before retrying
//             await new Promise(resolve => setTimeout(resolve, retries * 5000));
//         }
//     }
// };

// // Initialize all services
// const initializeServices = async () => {
//     try {
//         // Initialize Redis
//         redisClient = new Redis({
//             host: '127.0.0.1',
//             port: 6379,
//             retryStrategy(times) {
//                 const delay = Math.min(times * 50, 2000);
//                 return delay;
//             },
//             maxRetriesPerRequest: 3
//         });
//         console.log('Redis initialized');

//         // Initialize Elasticsearch
//         esClient = new Client({
//             node: 'http://localhost:9200',
//             maxRetries: 5,
//             requestTimeout: 30000
//         });
//         console.log('Elasticsearch client initialized');

//         // Initialize RabbitMQ with retry logic
//         const { connection, channel } = await initializeRabbitMQ();
//         mqConnection = connection;
//         mqChannel = channel;
//         console.log('RabbitMQ connected');

//         // Initialize services
//         esService = new ElasticSearchService(esClient);
//         await esService.initializeIndex();
//         console.log('Elasticsearch index initialized');

//         mqService = new MessageQueueService(mqChannel);
//         await mqService.initialize();
//         console.log('Message queue service initialized');

//         planService = new PlanService(redisClient, esService, mqService);
//         console.log('Plan service initialized');

//         // Initialize and start the indexing worker
//         worker = new IndexingWorker(mqService, esService);
//         await worker.start();
//         console.log('Indexing worker started');

//     } catch (error) {
//         console.error('Service initialization error:', error);
//         throw error;
//     }
// };

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Attach services to request object
// app.use((req, res, next) => {
//     req.services = {
//         redisClient,
//         esService,
//         mqService,
//         planService
//     };
//     next();
// });

// // Basic security headers
// app.use((req, res, next) => {
//     res.setHeader('X-Content-Type-Options', 'nosniff');
//     res.setHeader('X-Frame-Options', 'DENY');
//     res.setHeader('X-XSS-Protection', '1; mode=block');
//     next();
// });

// // Routes
// app.use('/api/plans', planRoutes);

// // Health check endpoint
// app.get('/health', async (req, res) => {
//     try {
//         const esHealth = await esClient.ping();
//         const redisHealth = await redisClient.ping();
//         const mqHealth = mqChannel && mqChannel.connection && mqChannel.connection.connecting === false;

//         res.json({
//             status: 'ok',
//             services: {
//                 redis: redisHealth ? 'connected' : 'not_connected',
//                 elasticsearch: esHealth ? 'connected' : 'not_connected',
//                 rabbitmq: mqHealth ? 'connected' : 'not_connected'
//             },
//             timestamp: new Date().toISOString()
//         });
//     } catch (error) {
//         res.status(503).json({
//             status: 'error',
//             message: error.message
//         });
//     }
// });

// // 404 handler
// app.use((req, res) => {
//     res.status(404).json({
//         error: 'Not Found',
//         message: `Cannot ${req.method} ${req.url}`
//     });
// });

// // Error handling
// app.use((err, req, res, next) => {
//     console.error('Error:', err);
//     res.status(err.status || 500).json({
//         error: err.name || 'Internal Server Error',
//         message: err.message,
//         ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//     });
// });

// // Graceful shutdown handler
// const shutdown = async () => {
//     console.log('Shutting down server...');
//     try {
//         if (worker) await worker.stop();
//         if (mqChannel) await mqChannel.close();
//         if (mqConnection) await mqConnection.close();
//         if (redisClient) await redisClient.quit();
//         process.exit(0);
//     } catch (error) {
//         console.error('Error during shutdown:', error);
//         process.exit(1);
//     }
// };

// // Handle shutdown signals
// process.on('SIGTERM', shutdown);
// process.on('SIGINT', shutdown);

// // Start server
// const startServer = async () => {
//     try {
//         await initializeServices();
        
//         app.listen(port, () => {
//             console.log(`Server running on port ${port}`);
//             console.log(`Health check: http://localhost:${port}/health`);
//             console.log('Available endpoints:');
//             console.log('  - POST   /api/plans');
//             console.log('  - GET    /api/plans/:id');
//             console.log('  - PUT    /api/plans/:id');
//             console.log('  - PATCH  /api/plans/:id');
//             console.log('  - DELETE /api/plans/:id');
//             console.log('  - GET    /api/plans/search/:serviceName');
//         });
//     } catch (error) {
//         console.error('Server startup error:', error);
//         process.exit(1);
//     }
// };

// startServer();

// export default app;

// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import Redis from 'ioredis';
// import { Client } from '@elastic/elasticsearch';
// import amqp from 'amqplib';
// import planRoutes from './routes/planRoutes.js';
// import { ElasticSearchService } from './services/elasticSearchService.js';
// import { MessageQueueService } from './services/messageQueue.service.js';
// import { PlanService } from './services/planService.js';
// import { IndexingWorker } from './workers/indexingWorker.js';

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;

// // Service clients
// let services = {
//     redisClient: null,
//     esClient: null,
//     mqConnection: null,
//     mqChannel: null,
//     esService: null,
//     mqService: null,
//     planService: null,
//     worker: null
// };

// // Initialize RabbitMQ with retry logic
// const initializeRabbitMQ = async () => {
//     const maxRetries = 5;
//     let retries = 0;

//     while (retries < maxRetries) {
//         try {
//             console.log('Attempting to connect to RabbitMQ...');
//             const connection = await amqp.connect({
//                 protocol: 'amqp',
//                 hostname: '127.0.0.1',
//                 port: 5672,
//                 username: 'vaishnavi',
//                 password: 'maggi123',
//                 vhost: '/'
//             });
            
//             connection.on('error', (error) => {
//                 console.error('RabbitMQ connection error:', error);
//             });

//             connection.on('close', () => {
//                 console.log('RabbitMQ connection closed');
//             });
            
//             const channel = await connection.createChannel();
            
//             // Setup queues
//             const queues = ['plan-created', 'plan-updated', 'plan-deleted'];
//             for (const queue of queues) {
//                 await channel.assertQueue(queue, {
//                     durable: true
//                 });
//             }

//             await channel.prefetch(1);
//             console.log('Successfully connected to RabbitMQ');
//             return { connection, channel };
//         } catch (error) {
//             retries++;
//             console.error(`Failed to connect to RabbitMQ (attempt ${retries}/${maxRetries}):`, error.message);
//             if (retries === maxRetries) {
//                 throw error;
//             }
//             await new Promise(resolve => setTimeout(resolve, retries * 5000));
//         }
//     }
// };

// // Initialize all services
// const initializeServices = async () => {
//     try {
//         // Initialize Redis
//         services.redisClient = new Redis({
//             host: '127.0.0.1',
//             port: 6379,
//             retryStrategy(times) {
//                 const delay = Math.min(times * 50, 2000);
//                 return delay;
//             },
//             maxRetriesPerRequest: 3
//         });
//         console.log('Redis initialized');

//         // Initialize Elasticsearch
//         services.esClient = new Client({
//             node: 'http://localhost:9200',
//             maxRetries: 5,
//             requestTimeout: 30000
//         });
//         console.log('Elasticsearch client initialized');

//         // Initialize RabbitMQ
//         const { connection, channel } = await initializeRabbitMQ();
//         services.mqConnection = connection;
//         services.mqChannel = channel;
//         console.log('RabbitMQ connected');

//         // Initialize services
//         services.esService = new ElasticSearchService(services.esClient);
//         await services.esService.initializeIndex();
//         console.log('Elasticsearch index initialized');

//         services.mqService = new MessageQueueService(services.mqChannel);
//         await services.mqService.initialize();
//         console.log('Message queue service initialized');

//         services.planService = new PlanService(
//             services.redisClient,
//             services.esService,
//             services.mqService
//         );
//         console.log('Plan service initialized');

//         // Initialize and start the indexing worker
//         services.worker = new IndexingWorker(services.mqService, services.esService);
//         await services.worker.start();
//         console.log('Indexing worker started');

//         return services;
//     } catch (error) {
//         console.error('Service initialization error:', error);
//         throw error;
//     }
// };

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Attach services to request object
// app.use((req, res, next) => {
//     req.services = {
//         redisClient: services.redisClient,
//         esService: services.esService,
//         mqService: services.mqService,
//         planService: services.planService
//     };
//     next();
// });

// // Basic security headers
// app.use((req, res, next) => {
//     res.setHeader('X-Content-Type-Options', 'nosniff');
//     res.setHeader('X-Frame-Options', 'DENY');
//     res.setHeader('X-XSS-Protection', '1; mode=block');
//     next();
// });

// // Routes
// app.use('/api/plans', planRoutes);

// // Health check endpoint
// app.get('/health', async (req, res) => {
//     try {
//         const esHealth = await services.esClient.ping();
//         const redisHealth = await services.redisClient.ping();
//         const mqHealth = services.mqChannel && !services.mqChannel.connection.closing;

//         res.json({
//             status: 'ok',
//             services: {
//                 redis: redisHealth === 'PONG' ? 'connected' : 'not_connected',
//                 elasticsearch: esHealth ? 'connected' : 'not_connected',
//                 rabbitmq: mqHealth ? 'connected' : 'not_connected'
//             },
//             timestamp: new Date().toISOString()
//         });
//     } catch (error) {
//         res.status(503).json({
//             status: 'error',
//             message: error.message,
//             timestamp: new Date().toISOString()
//         });
//     }
// });

// // 404 handler
// app.use((req, res) => {
//     res.status(404).json({
//         error: 'Not Found',
//         message: `Cannot ${req.method} ${req.url}`
//     });
// });

// // Error handling
// app.use((err, req, res, next) => {
//     console.error('Error:', err);
//     res.status(err.status || 500).json({
//         error: err.name || 'Internal Server Error',
//         message: err.message,
//         ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//     });
// });

// // Graceful shutdown handler
// const shutdown = async () => {
//     console.log('Shutting down server...');
//     try {
//         if (services.worker) await services.worker.stop();
//         if (services.mqChannel) await services.mqChannel.close();
//         if (services.mqConnection) await services.mqConnection.close();
//         if (services.redisClient) await services.redisClient.quit();
//         process.exit(0);
//     } catch (error) {
//         console.error('Error during shutdown:', error);
//         process.exit(1);
//     }
// };

// // Handle shutdown signals
// process.on('SIGTERM', shutdown);
// process.on('SIGINT', shutdown);

// // Start server
// const startServer = async () => {
//     try {
//         await initializeServices();
        
//         app.listen(port, () => {
//             console.log(`Server running on port ${port}`);
//             console.log(`Health check: http://localhost:${port}/health`);
//             console.log('Available endpoints:');
//             console.log('  - POST   /api/plans');
//             console.log('  - GET    /api/plans/:id');
//             console.log('  - PUT    /api/plans/:id');
//             console.log('  - PATCH  /api/plans/:id');
//             console.log('  - DELETE /api/plans/:id');
//             console.log('  - GET    /api/plans/search/:serviceName');
//         });
//     } catch (error) {
//         console.error('Server startup error:', error);
//         process.exit(1);
//     }
// };

// startServer();

// export default app;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Redis from 'ioredis';
import { Client } from '@elastic/elasticsearch';
import amqp from 'amqplib';
import planRoutes from './routes/planRoutes.js';
import { ElasticSearchService } from './services/elasticSearchService.js';
import { MessageQueueService } from './services/messageQueue.service.js';
import { PlanService } from './services/planService.js';
import { IndexingWorker } from './workers/indexingWorker.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 300;

// Service clients
let services = {
    redisClient: null,
    esClient: null,
    mqConnection: null,
    mqChannel: null,
    esService: null,
    mqService: null,
    planService: null,
    worker: null
};

// Initialize RabbitMQ with retry logic
const initializeRabbitMQ = async () => {
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            console.log('Attempting to connect to RabbitMQ...');
            const connection = await amqp.connect({
                protocol: 'amqp',
                hostname: process.env.RABBITMQ_HOST || '127.0.0.1',
                port: process.env.RABBITMQ_PORT || 5672,
                username: process.env.RABBITMQ_USER || 'vaishnavi',
                password: process.env.RABBITMQ_PASSWORD || 'maggi123',
                vhost: process.env.RABBITMQ_VHOST || '/'
            });

            connection.on('error', (error) => {
                console.error('RabbitMQ connection error:', error);
            });

            connection.on('close', () => {
                console.log('RabbitMQ connection closed');
            });

            const channel = await connection.createChannel();

            // Setup queues
            const queues = ['plan-created', 'plan-updated', 'plan-deleted'];
            for (const queue of queues) {
                await channel.assertQueue(queue, {
                    durable: true
                });
            }

            await channel.prefetch(1);
            console.log('Successfully connected to RabbitMQ');
            return { connection, channel };
        } catch (error) {
            retries++;
            console.error(`Failed to connect to RabbitMQ (attempt ${retries}/${maxRetries}):`, error.message);
            if (retries === maxRetries) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, retries * 5000));
        }
    }
};

// Initialize all services
const initializeServices = async () => {
    try {
        // Initialize Redis
        services.redisClient = new Redis({
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: process.env.REDIS_PORT || 6379,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 3
        });
        console.log('Redis initialized');

        // Initialize Elasticsearch
        services.esClient = new Client({
            node: process.env.ELASTICSEARCH_HOST || 'http://localhost:9200',
            maxRetries: 5,
            requestTimeout: 30000
        });
        console.log('Elasticsearch client initialized');

        // Initialize RabbitMQ
        const { connection, channel } = await initializeRabbitMQ();
        services.mqConnection = connection;
        services.mqChannel = channel;
        console.log('RabbitMQ connected');

        // Initialize services
        services.esService = new ElasticSearchService(services.esClient);
        await services.esService.initializeIndex();
        console.log('Elasticsearch index initialized');

        services.mqService = new MessageQueueService(services.mqChannel);
        await services.mqService.initialize();
        console.log('Message queue service initialized');

        services.planService = new PlanService(
            services.redisClient,
            services.esService,
            services.mqService
        );
        console.log('Plan service initialized');

        // Initialize and start the indexing worker
        services.worker = new IndexingWorker(services.mqService, services.esService);
        await services.worker.start();
        console.log('Indexing worker started');

        return services;
    } catch (error) {
        console.error('Service initialization error:', error);
        throw error;
    }
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Attach services to request object
app.use((req, res, next) => {
    req.services = {
        redisClient: services.redisClient,
        esService: services.esService,
        mqService: services.mqService,
        planService: services.planService
    };
    next();
});

// Basic security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Routes
app.use('/api/plans', planRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const esHealth = await services.esClient.ping();
        const redisHealth = await services.redisClient.ping();
        const mqHealth = services.mqChannel && !services.mqChannel.connection.closing;

        res.json({
            status: 'ok',
            services: {
                redis: redisHealth === 'PONG' ? 'connected' : 'not_connected',
                elasticsearch: esHealth ? 'connected' : 'not_connected',
                rabbitmq: mqHealth ? 'connected' : 'not_connected'
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            status: 'error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.url}`
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.name || 'Internal Server Error',
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Graceful shutdown handler
const shutdown = async () => {
    console.log('Shutting down server...');
    try {
        if (services.worker) await services.worker.stop();
        if (services.mqChannel) await services.mqChannel.close();
        if (services.mqConnection) await services.mqConnection.close();
        if (services.redisClient) await services.redisClient.quit();
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
};

// Handle shutdown signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start server
const startServer = async () => {
    try {
        await initializeServices();

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
            console.log(`Health check: http://localhost:${port}/health`);
            console.log('Available endpoints:');
            console.log('  - POST   /api/plans');
            console.log('  - GET    /api/plans/:id');
            console.log('  - PUT    /api/plans/:id');
            console.log('  - PATCH  /api/plans/:id');
            console.log('  - DELETE /api/plans/:id');
            console.log('  - GET    /api/plans/search/:serviceName');
        });
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
};

startServer();

export default app;
