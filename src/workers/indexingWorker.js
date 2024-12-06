export class IndexingWorker {
    constructor(mqService, esService) {
        if (!mqService || !esService) {
            throw new Error('MessageQueueService or ElasticSearchService not provided');
        }

        this.mqService = mqService;
        this.esService = esService;
        this.isRunning = false;

        console.log('Available ElasticSearchService methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.esService)));
    }

    async start() {
        try {
            this.isRunning = true;

            // Consumer for CREATE queue
            await this.mqService.startConsumer(this.mqService.queues.CREATE, async (data) => {
                if (data.operation === 'STORE') {
                    console.log('Processing CREATE message:', data);
                    await this.esService.indexPlan(data.body);
                }
            });

            // Consumer for UPDATE queue
            await this.mqService.startConsumer(this.mqService.queues.UPDATE, async (data) => {
                if (data.operation === 'STORE') {
                    console.log('Processing UPDATE message:', data);
                    await this.esService.indexPlan(data.body);
                }
            });

            // Consumer for DELETE queue
            await this.mqService.startConsumer(this.mqService.queues.DELETE, async (data) => {
                try {
                    console.log('Processing DELETE message:', data);

                    if (!data.planId) {
                        throw new Error('Invalid DELETE message: Missing "planId"');
                    }

                    if (data.operation === 'DELETE') {
                        console.log(`Deleting plan with ID: ${data.planId}`);
                        await this.esService.deletePlan(data.planId);
                        console.log(`Successfully deleted plan with ID: ${data.planId}`);
                    }
                } catch (error) {
                    if (error.meta?.statusCode === 404) {
                        console.warn(`Plan with ID ${data.planId} was not found in Elasticsearch. No action needed.`);
                    } else {
                        console.error('Error processing DELETE message:', error);
                        throw error; // Requeue the message
                    }
                }
            });

            console.log('Indexing worker started successfully');
        } catch (error) {
            console.error('Error starting indexing worker:', error);
            throw error;
        }
    }

    async stop() {
        try {
            this.isRunning = false;
            console.log('Indexing worker stopped');
        } catch (error) {
            console.error('Error stopping indexing worker:', error);
            throw error;
        }
    }
}