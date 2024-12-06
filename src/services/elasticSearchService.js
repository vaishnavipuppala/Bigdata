
import { Client } from '@elastic/elasticsearch';

export class ElasticSearchService {
    constructor(esClient) {
        this.esClient = esClient;
        this.indexName = process.env.ELASTICSEARCH_INDEX || 'healthcare_plans';
    }

    async initializeIndex() {
        try {
            const indexExists = await this.esClient.indices.exists({ index: this.indexName });

            if (!indexExists.body) {
                await this.esClient.indices.create({
                    index: this.indexName,
                    body: {
                        mappings: {
                            properties: {
                                plan: {
                                    type: 'join',
                                    relations: {
                                        healthcarePlan: ['linkedPlanServices', 'planserviceCostShares'],
                                    },
                                },
                                objectId: { type: 'keyword' },
                                objectType: { type: 'keyword' },
                                _org: { type: 'keyword' },
                                creationDate: {
                                    type: 'date',
                                    format: 'dd-MM-yyyy||yyyy-MM-dd||strict_date_optional_time||epoch_millis',
                                },
                                planCostShares: {
                                    type: 'nested',
                                    properties: {
                                        deductible: { type: 'integer' },
                                        copay: { type: 'integer' },
                                        objectId: { type: 'keyword' },
                                        _org: { type: 'keyword' },
                                    },
                                },
                                linkedPlanServices: {
                                    properties: {
                                        _org: { type: 'keyword' },
                                        objectId: { type: 'keyword' },
                                        linkedService: {
                                            properties: {
                                                _org: { type: 'keyword' },
                                                objectId: { type: 'keyword' },
                                                name: { type: 'text' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                console.log(`Elasticsearch index '${this.indexName}' created successfully.`);
            }
        } catch (error) {
            console.error('Error initializing Elasticsearch index:', error);
            throw error;
        }
    }

    async indexPlan(plan) {
        try {
            const parentDoc = { ...plan, plan: 'healthcarePlan' };
            await this.esClient.index({
                index: this.indexName,
                id: plan.objectId,
                body: parentDoc,
                refresh: true,
            });

            if (plan.linkedPlanServices) {
                for (const service of plan.linkedPlanServices) {
                    await this.indexChild(service, plan.objectId, 'linkedPlanServices');
                }
            }
        } catch (error) {
            console.error('Error indexing plan:', error);
            throw error;
        }
    }

    async indexChild(child, parentId, childType) {
        try {
            const childDoc = { ...child, plan: { name: childType, parent: parentId } };
            await this.esClient.index({
                index: this.indexName,
                id: child.objectId,
                routing: parentId,
                body: childDoc,
                refresh: true,
            });
        } catch (error) {
            console.error('Error indexing child document:', error);
            throw error;
        }
    }

    async deletePlan(planId) {
        try {
            await this.esClient.deleteByQuery({
                index: this.indexName,
                body: {
                    query: { term: { 'plan.parent': planId } },
                },
                refresh: true,
            });

            await this.esClient.delete({
                index: this.indexName,
                id: planId,
                refresh: true,
            });
        } catch (error) {
            console.error('Error deleting plan:', error);
            throw error;
        }
    }
}