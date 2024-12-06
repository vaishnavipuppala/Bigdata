
import crypto from 'crypto';

export class PlanService {
    constructor(redisClient, esService, mqService) {
        this.redisClient = redisClient;
        this.esService = esService;
        this.mqService = mqService;
    }

    generateEtag(data) {
        return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
    }

    async createPlan(plan) {
        if (!plan.objectId) {
            throw new Error('Plan must have an objectId');
        }

        const existingPlan = await this.redisClient.hget('plans', plan.objectId);
        if (existingPlan) {
            const error = new Error('Plan with this objectId already exists');
            error.statusCode = 409;
            throw error;
        }

        const etag = this.generateEtag(plan);
        const timestamp = new Date().toISOString();

        try {
            // Store in Redis
            await this.redisClient.hset('plans', plan.objectId, JSON.stringify({
                data: plan,
                etag,
                lastModified: timestamp
            }));

            // Index in Elasticsearch
            await this.esService.indexPlan(plan);

            // Queue for processing (optional for further workflows)
            await this.mqService.publishMessage(this.mqService.queues.CREATE, {
                operation: 'CREATE',
                plan,
                timestamp
            });

            return { plan, etag, lastModified: timestamp };
        } catch (error) {
            await this.redisClient.hdel('plans', plan.objectId); // Rollback Redis if something fails
            throw error;
        }
    }
    async getPlan(id, headers = {}) {
        try {
            const { 'if-none-match': ifNoneMatch, 'if-match': ifMatch } = headers;
            console.log(`Fetching plan with ID: ${id}`);
    
            // Fetch plan from Redis
            const stored = await this.redisClient.hget('plans', id);
            console.log(`Fetched plan from Redis:`, stored);
    
            if (!stored) {
                console.warn(`Plan with ID ${id} not found in Redis`);
                return { status: 404 };
            }
    
            const { data: plan, etag: currentEtag, lastModified } = JSON.parse(stored);
    
            if (ifNoneMatch && ifNoneMatch === currentEtag) {
                return { status: 304, etag: currentEtag, lastModified };
            }
    
            if (ifMatch && ifMatch !== currentEtag) {
                return { status: 412 };
            }
    
            return { status: 200, plan, etag: currentEtag, lastModified };
        } catch (error) {
            console.error('Error in getPlan:', error);
            throw error;
        }
    }
    
    async getPlan(id, headers = {}) {
        const { 'if-none-match': ifNoneMatch, 'if-match': ifMatch } = headers;

        // Fetch from Redis
        const stored = await this.redisClient.hget('plans', id);
        if (!stored) {
            return { status: 404 };
        }

        const { data: plan, etag: currentEtag, lastModified } = JSON.parse(stored);

        if (ifNoneMatch && ifNoneMatch === currentEtag) {
            return { status: 304, etag: currentEtag, lastModified };
        }

        if (ifMatch && ifMatch !== currentEtag) {
            return { status: 412 };
        }

        return { status: 200, plan, etag: currentEtag, lastModified };
    }

    async updatePlan(id, updates, headers = {}) {
        const { 'if-match': ifMatch } = headers;

        const stored = await this.redisClient.hget('plans', id);
        if (!stored) return { status: 404 };

        const { data: currentPlan, etag: currentEtag } = JSON.parse(stored);

        if (ifMatch && ifMatch !== currentEtag) {
            return { status: 412 };
        }

        const updatedPlan = { ...currentPlan, ...updates };
        const newEtag = this.generateEtag(updatedPlan);
        const timestamp = new Date().toISOString();

        try {
            // Update in Redis
            await this.redisClient.hset('plans', id, JSON.stringify({
                data: updatedPlan,
                etag: newEtag,
                lastModified: timestamp
            }));

            // Update in Elasticsearch
            await this.esService.indexPlan(updatedPlan);

            // Queue update operation (optional for workflows)
            await this.mqService.publishMessage(this.mqService.queues.UPDATE, {
                operation: 'UPDATE',
                plan: updatedPlan,
                timestamp
            });

            return { status: 200, plan: updatedPlan, etag: newEtag, lastModified: timestamp };
        } catch (error) {
            if (stored) {
                await this.redisClient.hset('plans', id, stored); // Rollback Redis on error
            }
            throw error;
        }
    }

    async deletePlan(id, headers = {}) {
        const { 'if-match': ifMatch } = headers;

        const stored = await this.redisClient.hget('plans', id);
        if (!stored) return { status: 404 };

        const { etag: currentEtag } = JSON.parse(stored);

        if (ifMatch && ifMatch !== currentEtag) {
            return { status: 412 };
        }

        try {
            // Delete from Redis
            await this.redisClient.hdel('plans', id);

            // Delete from Elasticsearch
            await this.esService.deletePlan(id);

            // Queue delete operation
            await this.mqService.publishMessage(this.mqService.queues.DELETE, {
                operation: 'DELETE',
                planId: id,
                timestamp: new Date().toISOString()
            });

            return { status: 204 };
        } catch (error) {
            if (stored) {
                await this.redisClient.hset('plans', id, stored); // Rollback Redis on error
            }
            throw error;
        }
    }

    async searchPlansByService(serviceName) {
        return this.esService.searchPlansByService(serviceName);
    }
}