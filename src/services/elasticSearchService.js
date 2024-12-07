
// // import { Client } from '@elastic/elasticsearch';

// // export class ElasticSearchService {
// //     constructor(esClient) {
// //         this.esClient = esClient;
// //         this.indexName = process.env.ELASTICSEARCH_INDEX || 'healthcare_plans';
// //     }

// //     async initializeIndex() {
// //         try {
// //             const indexExists = await this.esClient.indices.exists({ index: this.indexName });

// //             if (!indexExists.body) {
// //                 await this.esClient.indices.create({
// //                     index: this.indexName,
// //                     body: {
// //                         mappings: {
// //                             properties: {
// //                                 plan: {
// //                                     type: 'join',
// //                                     relations: {
// //                                         healthcarePlan: ['linkedPlanServices', 'planserviceCostShares'],
// //                                     },
// //                                 },
// //                                 objectId: { type: 'keyword' },
// //                                 objectType: { type: 'keyword' },
// //                                 _org: { type: 'keyword' },
// //                                 creationDate: {
// //                                     type: 'date',
// //                                     format: 'dd-MM-yyyy||yyyy-MM-dd||strict_date_optional_time||epoch_millis',
// //                                 },
// //                                 planCostShares: {
// //                                     type: 'nested',
// //                                     properties: {
// //                                         deductible: { type: 'integer' },
// //                                         copay: { type: 'integer' },
// //                                         objectId: { type: 'keyword' },
// //                                         _org: { type: 'keyword' },
// //                                     },
// //                                 },
// //                                 linkedPlanServices: {
// //                                     properties: {
// //                                         _org: { type: 'keyword' },
// //                                         objectId: { type: 'keyword' },
// //                                         linkedService: {
// //                                             properties: {
// //                                                 _org: { type: 'keyword' },
// //                                                 objectId: { type: 'keyword' },
// //                                                 name: { type: 'text' },
// //                                             },
// //                                         },
// //                                     },
// //                                 },
// //                             },
// //                         },
// //                     },
// //                 });
// //                 console.log(`Elasticsearch index '${this.indexName}' created successfully.`);
// //             }
// //         } catch (error) {
// //             console.error('Error initializing Elasticsearch index:', error);
// //             throw error;
// //         }
// //     }

// //     async indexPlan(plan) {
// //         try {
// //             const parentDoc = { ...plan, plan: 'healthcarePlan' };
// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: plan.objectId,
// //                 body: parentDoc,
// //                 refresh: true,
// //             });

// //             if (plan.linkedPlanServices) {
// //                 for (const service of plan.linkedPlanServices) {
// //                     await this.indexChild(service, plan.objectId, 'linkedPlanServices');
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Error indexing plan:', error);
// //             throw error;
// //         }
// //     }

// //     async indexChild(child, parentId, childType) {
// //         try {
// //             const childDoc = { ...child, plan: { name: childType, parent: parentId } };
// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: child.objectId,
// //                 routing: parentId,
// //                 body: childDoc,
// //                 refresh: true,
// //             });
// //         } catch (error) {
// //             console.error('Error indexing child document:', error);
// //             throw error;
// //         }
// //     }

// //     async deletePlan(planId) {
// //         try {
// //             await this.esClient.deleteByQuery({
// //                 index: this.indexName,
// //                 body: {
// //                     query: { term: { 'plan.parent': planId } },
// //                 },
// //                 refresh: true,
// //             });

// //             await this.esClient.delete({
// //                 index: this.indexName,
// //                 id: planId,
// //                 refresh: true,
// //             });
// //         } catch (error) {
// //             console.error('Error deleting plan:', error);
// //             throw error;
// //         }
// //     }
// // }

// // import { Client } from '@elastic/elasticsearch';

// // export class ElasticSearchService {
// //     constructor(esClient) {
// //         this.esClient = esClient;
// //         this.indexName = process.env.ELASTICSEARCH_INDEX || 'healthcare_plans';
// //     }

// //     // **Initialize the Index with Parent-Child Relationship**
// //     async initializeIndex() {
// //         try {
// //             const indexExists = await this.esClient.indices.exists({ index: this.indexName });

// //             if (!indexExists.body) {
// //                 await this.esClient.indices.create({
// //                     index: this.indexName,
// //                     body: {
// //                         mappings: {
// //                             properties: {
// //                                 plan: {
// //                                     type: 'join',
// //                                     relations: {
// //                                         healthcarePlan: ['linkedPlanServices', 'planserviceCostShares'], // Define Parent-Child relationships
// //                                     },
// //                                 },
// //                                 objectId: { type: 'keyword' },
// //                                 objectType: { type: 'keyword' },
// //                                 _org: { type: 'keyword' },
// //                                 creationDate: {
// //                                     type: 'date',
// //                                     format: 'dd-MM-yyyy||yyyy-MM-dd||strict_date_optional_time||epoch_millis',
// //                                 },
// //                                 planCostShares: {
// //                                     type: 'nested',
// //                                     properties: {
// //                                         deductible: { type: 'integer' },
// //                                         copay: { type: 'integer' },
// //                                         objectId: { type: 'keyword' },
// //                                         _org: { type: 'keyword' },
// //                                     },
// //                                 },
// //                                 linkedPlanServices: {
// //                                     properties: {
// //                                         _org: { type: 'keyword' },
// //                                         objectId: { type: 'keyword' },
// //                                         linkedService: {
// //                                             properties: {
// //                                                 _org: { type: 'keyword' },
// //                                                 objectId: { type: 'keyword' },
// //                                                 name: { type: 'text' },
// //                                             },
// //                                         },
// //                                     },
// //                                 },
// //                             },
// //                         },
// //                     },
// //                 });
// //                 console.log(`Elasticsearch index '${this.indexName}' created successfully.`);
// //             }
// //         } catch (error) {
// //             console.error('Error initializing Elasticsearch index:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Parent Plan**
// //     async indexPlan(plan) {
// //         try {
// //             // Index the parent plan
// //             const parentDoc = { ...plan, plan: 'healthcarePlan' }; // Include join metadata for parent
// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: plan.objectId,
// //                 body: parentDoc,
// //                 refresh: true,
// //             });

// //             // Index linked plan services (children)
// //             if (plan.linkedPlanServices) {
// //                 for (const service of plan.linkedPlanServices) {
// //                     await this.indexChild(service, plan.objectId, 'linkedPlanServices');
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Error indexing plan:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Child Documents**
// //     async indexChild(child, parentId, childType) {
// //         try {
// //             const childDoc = {
// //                 ...child,
// //                 plan: {
// //                     name: childType, // Specify child relationship type
// //                     parent: parentId, // Link to parent
// //                 },
// //             };
// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: child.objectId,
// //                 routing: parentId, // Ensure routing to parent
// //                 body: childDoc,
// //                 refresh: true,
// //             });
// //         } catch (error) {
// //             console.error('Error indexing child document:', error);
// //             throw error;
// //         }
// //     }

// //     // **Search Child Documents by Parent**
// //     async searchChildrenByParent(parentId, childType) {
// //         try {
// //             const result = await this.esClient.search({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         has_parent: {
// //                             parent_type: 'healthcarePlan', // Parent type
// //                             query: {
// //                                 term: {
// //                                     objectId: parentId, // Parent ID to search children
// //                                 },
// //                             },
// //                         },
// //                     },
// //                 },
// //             });
// //             return result.body.hits.hits;
// //         } catch (error) {
// //             console.error('Error searching child documents:', error);
// //             throw error;
// //         }
// //     }

// //     // **Search Parent Documents by Child**
// //     async searchParentByChild(childId) {
// //         try {
// //             const result = await this.esClient.search({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         has_child: {
// //                             type: 'linkedPlanServices', // Child type
// //                             query: {
// //                                 term: {
// //                                     objectId: childId, // Child ID to search parent
// //                                 },
// //                             },
// //                         },
// //                     },
// //                 },
// //             });
// //             return result.body.hits.hits;
// //         } catch (error) {
// //             console.error('Error searching parent documents:', error);
// //             throw error;
// //         }
// //     }

// //     // **Delete a Parent Document and Its Children**
// //     async deletePlan(planId) {
// //         try {
// //             // Delete all child documents
// //             await this.esClient.deleteByQuery({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         term: { 'plan.parent': planId }, // Query children linked to the parent
// //                     },
// //                 },
// //                 refresh: true,
// //             });

// //             // Delete the parent document
// //             await this.esClient.delete({
// //                 index: this.indexName,
// //                 id: planId,
// //                 refresh: true,
// //             });

// //             console.log(`Plan with ID ${planId} and its children deleted successfully.`);
// //         } catch (error) {
// //             console.error('Error deleting plan:', error);
// //             throw error;
// //         }
// //     }
// // }
// // import { Client } from '@elastic/elasticsearch';

// // export class ElasticSearchService {
// //     constructor(esClient) {
// //         this.esClient = esClient;
// //         this.indexName = process.env.ELASTICSEARCH_INDEX || 'healthcare_plans';
// //     }

// //     // **Initialize the Index with Parent-Child Relationship**
// //     async initializeIndex() {
// //         try {
// //             const indexExists = await this.esClient.indices.exists({ index: this.indexName });

// //             if (!indexExists.body) {
// //                 await this.esClient.indices.create({
// //                     index: this.indexName,
// //                     body: {
// //                         mappings: {
// //                             properties: {
// //                                 plan: {
// //                                     type: 'join',
// //                                     relations: {
// //                                         healthcarePlan: ['linkedPlanServices', 'planserviceCostShares'], // Define Parent-Child relationships
// //                                     },
// //                                 },
// //                                 objectId: { type: 'keyword' },
// //                                 objectType: { type: 'keyword' },
// //                                 _org: { type: 'keyword' },
// //                                 creationDate: {
// //                                     type: 'date',
// //                                     format: 'dd-MM-yyyy||yyyy-MM-dd||strict_date_optional_time||epoch_millis',
// //                                 },
// //                                 planCostShares: {
// //                                     type: 'nested',
// //                                     properties: {
// //                                         deductible: { type: 'integer' },
// //                                         copay: { type: 'integer' },
// //                                         objectId: { type: 'keyword' },
// //                                         _org: { type: 'keyword' },
// //                                     },
// //                                 },
// //                                 linkedPlanServices: {
// //                                     properties: {
// //                                         _org: { type: 'keyword' },
// //                                         objectId: { type: 'keyword' },
// //                                         linkedService: {
// //                                             properties: {
// //                                                 _org: { type: 'keyword' },
// //                                                 objectId: { type: 'keyword' },
// //                                                 name: { type: 'text' },
// //                                             },
// //                                         },
// //                                     },
// //                                 },
// //                             },
// //                         },
// //                     },
// //                 });
// //                 console.log(`Elasticsearch index '${this.indexName}' created successfully.`);
// //             }
// //         } catch (error) {
// //             console.error('Error initializing Elasticsearch index:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Parent Plan**
// //     async indexPlan(plan) {
// //         try {
// //             // Index the parent plan
// //             const parentDoc = {
// //                 ...plan,
// //                 plan: 'healthcarePlan', // Add the parent join metadata
// //             };

// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: plan.objectId,
// //                 body: parentDoc,
// //                 refresh: true,
// //             });

// //             console.log(`Parent plan indexed with ID: ${plan.objectId}`);

// //             // Index linked plan services as children
// //             if (plan.linkedPlanServices) {
// //                 for (const service of plan.linkedPlanServices) {
// //                     const childId = service.objectId;
// //                     const childData = {
// //                         ...service,
// //                         plan: {
// //                             name: 'linkedPlanServices', // Child type
// //                             parent: plan.objectId, // Link to parent
// //                         },
// //                     };

// //                     await this.indexChild(childId, childData, plan.objectId);
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Error indexing plan:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Child Documents**
// //     async indexChild(childId, childData, parentId) {
// //         try {
// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: childId,
// //                 routing: parentId, // Ensure routing to parent
// //                 body: childData,
// //                 refresh: true,
// //             });
// //             console.log(`Child document indexed with ID: ${childId}, linked to parent: ${parentId}`);
// //         } catch (error) {
// //             console.error('Error indexing child document:', error);
// //             throw error;
// //         }
// //     }

// //     // **Search Child Documents by Parent**
// //     async searchChildrenByParent(parentId) {
// //         try {
// //             const result = await this.esClient.search({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         has_parent: {
// //                             parent_type: 'healthcarePlan', // Parent type
// //                             query: {
// //                                 term: {
// //                                     objectId: parentId, // Parent ID
// //                                 },
// //                             },
// //                         },
// //                     },
// //                 },
// //             });
// //             return result.body.hits.hits;
// //         } catch (error) {
// //             console.error('Error searching child documents:', error);
// //             throw error;
// //         }
// //     }

// //     // **Search Parent Documents by Child**
// //     async searchParentByChild(childId) {
// //         try {
// //             const result = await this.esClient.search({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         has_child: {
// //                             type: 'linkedPlanServices', // Child type
// //                             query: {
// //                                 term: {
// //                                     objectId: childId, // Child ID
// //                                 },
// //                             },
// //                         },
// //                     },
// //                 },
// //             });
// //             return result.body.hits.hits;
// //         } catch (error) {
// //             console.error('Error searching parent documents:', error);
// //             throw error;
// //         }
// //     }

// //     // **Delete a Parent Document and Its Children**
// //     async deletePlan(planId) {
// //         try {
// //             // Delete all child documents linked to the parent
// //             await this.esClient.deleteByQuery({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         term: {
// //                             'plan.parent': planId, // Match children linked to the parent
// //                         },
// //                     },
// //                 },
// //                 refresh: true,
// //             });

// //             // Delete the parent document
// //             await this.esClient.delete({
// //                 index: this.indexName,
// //                 id: planId,
// //                 refresh: true,
// //             });

// //             console.log(`Plan with ID ${planId} and its children deleted successfully.`);
// //         } catch (error) {
// //             console.error('Error deleting plan:', error);
// //             throw error;
// //         }
// //     }
// // }


// // import { Client } from '@elastic/elasticsearch';

// // export class ElasticSearchService {
// //     constructor(esClient) {
// //         this.esClient = esClient;
// //         this.indexName = process.env.ELASTICSEARCH_INDEX || 'healthcare_plans';
// //     }

// //     // **Initialize the Index with Parent-Child Relationship**
// //     async initializeIndex() {
// //         try {
// //             const indexExists = await this.esClient.indices.exists({ index: this.indexName });

// //             if (!indexExists.body) {
// //                 await this.esClient.indices.create({
// //                     index: this.indexName,
// //                     body: {
// //                         mappings: {
// //                             properties: {
// //                                 plan: {
// //                                     type: 'join',
// //                                     relations: {
// //                                         healthcarePlan: ['linkedPlanServices', 'planCostShares', 'planserviceCostShares'], // Define Parent-Child relationships
// //                                     },
// //                                 },
// //                                 objectId: { type: 'keyword' },
// //                                 objectType: { type: 'keyword' },
// //                                 _org: { type: 'keyword' },
// //                                 creationDate: {
// //                                     type: 'date',
// //                                     format: 'dd-MM-yyyy||yyyy-MM-dd||strict_date_optional_time||epoch_millis',
// //                                 },
// //                                 linkedPlanServices: {
// //                                     properties: {
// //                                         _org: { type: 'keyword' },
// //                                         objectId: { type: 'keyword' },
// //                                         linkedService: {
// //                                             properties: {
// //                                                 _org: { type: 'keyword' },
// //                                                 objectId: { type: 'keyword' },
// //                                                 name: { type: 'text' },
// //                                             },
// //                                         },
// //                                     },
// //                                 },
// //                                 planCostShares: {
// //                                     properties: {
// //                                         deductible: { type: 'integer' },
// //                                         copay: { type: 'integer' },
// //                                         objectId: { type: 'keyword' },
// //                                         _org: { type: 'keyword' },
// //                                     },
// //                                 },
// //                             },
// //                         },
// //                     },
// //                 });
// //                 console.log(`Elasticsearch index '${this.indexName}' created successfully.`);
// //             }
// //         } catch (error) {
// //             console.error('Error initializing Elasticsearch index:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Parent and All Nested Elements**
// //     async indexPlan(plan) {
// //         try {
// //             // Index the parent plan
// //             await this.indexParent(plan);

// //             // Index the nested planCostShares
// //             if (plan.planCostShares) {
// //                 await this.indexChild(
// //                     plan.planCostShares.objectId,
// //                     {
// //                         ...plan.planCostShares,
// //                         plan: {
// //                             name: 'planCostShares',
// //                             parent: plan.objectId,
// //                         },
// //                     },
// //                     plan.objectId
// //                 );
// //             }

// //             // Index the linkedPlanServices and their nested planserviceCostShares
// //             if (plan.linkedPlanServices) {
// //                 for (const service of plan.linkedPlanServices) {
// //                     // Index the service as a child of the parent plan
// //                     await this.indexChild(
// //                         service.objectId,
// //                         {
// //                             ...service,
// //                             plan: {
// //                                 name: 'linkedPlanServices',
// //                                 parent: plan.objectId,
// //                             },
// //                         },
// //                         plan.objectId
// //                     );

// //                     // Index the planserviceCostShares as a child of the linked service
// //                     if (service.planserviceCostShares) {
// //                         await this.indexChild(
// //                             service.planserviceCostShares.objectId,
// //                             {
// //                                 ...service.planserviceCostShares,
// //                                 plan: {
// //                                     name: 'planserviceCostShares',
// //                                     parent: service.objectId,
// //                                 },
// //                             },
// //                             service.objectId
// //                         );
// //                     }
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Error indexing plan:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Parent Document**
// //     async indexParent(parentData) {
// //         try {
// //             const parentDoc = {
// //                 ...parentData,
// //                 plan: 'healthcarePlan', // Add parent join metadata
// //             };

// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: parentData.objectId,
// //                 body: parentDoc,
// //                 refresh: true,
// //             });

// //             console.log(`Parent indexed with ID: ${parentData.objectId}`);
// //         } catch (error) {
// //             console.error('Error indexing parent document:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Child Document**
// //     async indexChild(childId, childData, parentId) {
// //         try {
// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: childId,
// //                 routing: parentId, // Ensure routing to parent
// //                 body: childData,
// //                 refresh: true,
// //             });
// //             console.log(`Child indexed with ID: ${childId}, linked to parent: ${parentId}`);
// //         } catch (error) {
// //             console.error('Error indexing child document:', error);
// //             throw error;
// //         }
// //     }

// //     // **Fetch All Documents**
// //     async getAllDocuments() {
// //         try {
// //             const result = await this.esClient.search({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         match_all: {}, // Match all documents
// //                     },
// //                 },
// //             });
// //             return result.body.hits.hits;
// //         } catch (error) {
// //             console.error('Error fetching all documents:', error);
// //             throw error;
// //         }
// //     }

// //     // **Delete Plan and All Nested Elements**
// //     async deletePlan(planId) {
// //         try {
// //             // Delete all child documents linked to the parent
// //             await this.esClient.deleteByQuery({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         term: {
// //                             'plan.parent': planId, // Match children linked to the parent
// //                         },
// //                     },
// //                 },
// //                 refresh: true,
// //             });

// //             // Delete the parent document
// //             await this.esClient.delete({
// //                 index: this.indexName,
// //                 id: planId,
// //                 refresh: true,
// //             });

// //             console.log(`Plan with ID ${planId} and its children deleted successfully.`);
// //         } catch (error) {
// //             console.error('Error deleting plan:', error);
// //             throw error;
// //         }
// //     }
// // }



// // REVISED CODE

// // import { Client } from '@elastic/elasticsearch';

// // export class ElasticSearchService {
// //     constructor(esClient) {
// //         this.esClient = esClient;
// //         this.indexName = process.env.ELASTICSEARCH_INDEX || 'healthcare_plans';
// //     }

// //     // **Initialize Index with Parent-Child Relationship**
// //     async initializeIndex() {
// //         try {
// //             const indexExists = await this.esClient.indices.exists({ index: this.indexName });

// //             if (!indexExists.body) {
// //                 await this.esClient.indices.create({
// //                     index: this.indexName,
// //                     body: {
// //                         mappings: {
// //                             properties: {
// //                                 plan: {
// //                                     type: 'join',
// //                                     relations: {
// //                                         healthcarePlan: ['linkedPlanServices', 'planCostShares', 'planserviceCostShares', 'linkedService'], // Define all relationships
// //                                     },
// //                                 },
// //                                 objectId: { type: 'keyword' },
// //                                 objectType: { type: 'keyword' },
// //                                 _org: { type: 'keyword' },
// //                                 creationDate: {
// //                                     type: 'date',
// //                                     format: 'dd-MM-yyyy||yyyy-MM-dd||strict_date_optional_time||epoch_millis',
// //                                 },
// //                                 linkedPlanServices: {
// //                                     properties: {
// //                                         _org: { type: 'keyword' },
// //                                         objectId: { type: 'keyword' },
// //                                         linkedService: {
// //                                             properties: {
// //                                                 _org: { type: 'keyword' },
// //                                                 objectId: { type: 'keyword' },
// //                                                 name: { type: 'text' },
// //                                             },
// //                                         },
// //                                     },
// //                                 },
// //                                 planCostShares: {
// //                                     properties: {
// //                                         deductible: { type: 'integer' },
// //                                         copay: { type: 'integer' },
// //                                         objectId: { type: 'keyword' },
// //                                         _org: { type: 'keyword' },
// //                                     },
// //                                 },
// //                             },
// //                         },
// //                     },
// //                 });
// //                 console.log(`Elasticsearch index '${this.indexName}' created successfully.`);
// //             }
// //         } catch (error) {
// //             console.error('Error initializing Elasticsearch index:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Plan and All Nested Elements**
// //     async indexPlan(plan) {
// //         try {
// //             // Index the parent plan
// //             await this.indexParent(plan);

// //             // Index planCostShares as a child of the parent plan
// //             if (plan.planCostShares) {
// //                 await this.indexChild(
// //                     plan.planCostShares.objectId,
// //                     {
// //                         ...plan.planCostShares,
// //                         plan: {
// //                             name: 'planCostShares',
// //                             parent: plan.objectId,
// //                         },
// //                     },
// //                     plan.objectId
// //                 );
// //             }

// //             // Index linkedPlanServices and their nested elements
// //             if (plan.linkedPlanServices) {
// //                 for (const service of plan.linkedPlanServices) {
// //                     // Index linkedPlanServices as a child of the parent plan
// //                     await this.indexChild(
// //                         service.objectId,
// //                         {
// //                             ...service,
// //                             plan: {
// //                                 name: 'linkedPlanServices',
// //                                 parent: plan.objectId,
// //                             },
// //                         },
// //                         plan.objectId
// //                     );

// //                     // Index linkedService as a child of linkedPlanServices
// //                     if (service.linkedService) {
// //                         await this.indexChild(
// //                             service.linkedService.objectId,
// //                             {
// //                                 ...service.linkedService,
// //                                 plan: {
// //                                     name: 'linkedService',
// //                                     parent: service.objectId,
// //                                 },
// //                             },
// //                             service.objectId
// //                         );
// //                     }

// //                     // Index planserviceCostShares as a child of linkedPlanServices
// //                     if (service.planserviceCostShares) {
// //                         await this.indexChild(
// //                             service.planserviceCostShares.objectId,
// //                             {
// //                                 ...service.planserviceCostShares,
// //                                 plan: {
// //                                     name: 'planserviceCostShares',
// //                                     parent: service.objectId,
// //                                 },
// //                             },
// //                             service.objectId
// //                         );
// //                     }
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Error indexing plan:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Parent Document**
// //     async indexParent(parentData) {
// //         try {
// //             const parentDoc = {
// //                 ...parentData,
// //                 plan: 'healthcarePlan', // Add join metadata for the parent
// //             };

// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: parentData.objectId,
// //                 body: parentDoc,
// //                 refresh: true,
// //             });

// //             console.log(`Parent document indexed with ID: ${parentData.objectId}`);
// //         } catch (error) {
// //             console.error('Error indexing parent document:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Child Document**
// //     async indexChild(childId, childData, parentId) {
// //         try {
// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: childId,
// //                 routing: parentId, // Routing ensures the document is linked to the parent
// //                 body: childData,
// //                 refresh: true,
// //             });
// //             console.log(`Child document indexed with ID: ${childId}, linked to parent: ${parentId}`);
// //         } catch (error) {
// //             console.error('Error indexing child document:', error);
// //             throw error;
// //         }
// //     }

// //     // **Fetch All Documents**
// //     async getAllDocuments() {
// //         try {
// //             const result = await this.esClient.search({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         match_all: {}, // Fetch all documents
// //                     },
// //                 },
// //             });
// //             return result.body.hits.hits;
// //         } catch (error) {
// //             console.error('Error fetching all documents:', error);
// //             throw error;
// //         }
// //     }

// //     // **Delete Plan and All Nested Elements**
// //     async deletePlan(planId) {
// //         try {
// //             // Delete all child documents linked to the parent
// //             await this.esClient.deleteByQuery({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         term: {
// //                             'plan.parent': planId, // Match all children linked to the parent
// //                         },
// //                     },
// //                 },
// //                 refresh: true,
// //             });

// //             // Delete the parent document
// //             await this.esClient.delete({
// //                 index: this.indexName,
// //                 id: planId,
// //                 refresh: true,
// //             });

// //             console.log(`Plan with ID ${planId} and its children deleted successfully.`);
// //         } catch (error) {
// //             console.error('Error deleting plan:', error);
// //             throw error;
// //         }
// //     }
// // }


// // import { Client } from '@elastic/elasticsearch';

// // export class ElasticSearchService {
// //     constructor(esClient) {
// //         this.esClient = esClient;
// //         this.indexName = process.env.ELASTICSEARCH_INDEX || 'healthcare_plans';
// //     }

// //     // **Initialize Index with Parent-Child Relationship**
// //     async initializeIndex() {
// //         try {
// //             const indexExists = await this.esClient.indices.exists({ index: this.indexName });

// //             if (!indexExists.body) {
// //                 await this.esClient.indices.create({
// //                     index: this.indexName,
// //                     body: {
// //                         mappings: {
// //                             properties: {
// //                                 plan: {
// //                                     type: 'join',
// //                                     relations: {
// //                                         healthcarePlan: ['linkedPlanServices', 'planCostShares', 'planserviceCostShares', 'linkedService'], // Define all relationships
// //                                     },
// //                                 },
// //                                 objectId: { type: 'keyword' },
// //                                 objectType: { type: 'keyword' },
// //                                 _org: { type: 'keyword' },
// //                                 creationDate: {
// //                                     type: 'date',
// //                                     format: 'dd-MM-yyyy||yyyy-MM-dd||strict_date_optional_time||epoch_millis',
// //                                 },
// //                                 planCostShares: {
// //                                     properties: {
// //                                         deductible: { type: 'integer' },
// //                                         copay: { type: 'integer' },
// //                                         objectId: { type: 'keyword' },
// //                                         _org: { type: 'keyword' },
// //                                     },
// //                                 },
// //                                 linkedPlanServices: {
// //                                     properties: {
// //                                         objectId: { type: 'keyword' },
// //                                         linkedService: {
// //                                             properties: {
// //                                                 objectId: { type: 'keyword' },
// //                                                 name: { type: 'text' },
// //                                             },
// //                                         },
// //                                     },
// //                                 },
// //                             },
// //                         },
// //                     },
// //                 });
// //                 console.log(`Elasticsearch index '${this.indexName}' created successfully.`);
// //             }
// //         } catch (error) {
// //             console.error('Error initializing Elasticsearch index:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Parent and All Nested Elements**
// //     async indexPlan(plan) {
// //         try {
// //             // Index the parent healthcarePlan
// //             await this.indexParent(plan);

// //             // Index planCostShares as a child of the parent healthcarePlan
// //             if (plan.planCostShares) {
// //                 await this.indexChild(
// //                     plan.planCostShares.objectId,
// //                     {
// //                         ...plan.planCostShares,
// //                         plan: {
// //                             name: 'planCostShares',
// //                             parent: plan.objectId,
// //                         },
// //                     },
// //                     plan.objectId
// //                 );
// //             }

// //             // Index linkedPlanServices and their nested elements
// //             if (plan.linkedPlanServices) {
// //                 for (const service of plan.linkedPlanServices) {
// //                     // Index linkedPlanServices as a child of healthcarePlan
// //                     await this.indexChild(
// //                         service.objectId,
// //                         {
// //                             ...service,
// //                             plan: {
// //                                 name: 'linkedPlanServices',
// //                                 parent: plan.objectId,
// //                             },
// //                         },
// //                         plan.objectId
// //                     );

// //                     // Index linkedService as a child of linkedPlanServices
// //                     if (service.linkedService) {
// //                         await this.indexChild(
// //                             service.linkedService.objectId,
// //                             {
// //                                 ...service.linkedService,
// //                                 plan: {
// //                                     name: 'linkedService',
// //                                     parent: service.objectId,
// //                                 },
// //                             },
// //                             service.objectId
// //                         );
// //                     }

// //                     // Index planserviceCostShares as a child of linkedPlanServices
// //                     if (service.planserviceCostShares) {
// //                         await this.indexChild(
// //                             service.planserviceCostShares.objectId,
// //                             {
// //                                 ...service.planserviceCostShares,
// //                                 plan: {
// //                                     name: 'planserviceCostShares',
// //                                     parent: service.objectId,
// //                                 },
// //                             },
// //                             service.objectId
// //                         );
// //                     }
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Error indexing plan:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Parent Document**
// //     async indexParent(parentData) {
// //         try {
// //             const parentDoc = {
// //                 ...parentData,
// //                 plan: 'healthcarePlan', // Add join metadata for the parent
// //             };

// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: parentData.objectId,
// //                 body: parentDoc,
// //                 refresh: true,
// //             });

// //             console.log(`Parent document indexed with ID: ${parentData.objectId}`);
// //         } catch (error) {
// //             console.error('Error indexing parent document:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Child Document**
// //     async indexChild(childId, childData, parentId) {
// //         try {
// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: childId,
// //                 routing: parentId, // Routing ensures the document is linked to the parent
// //                 body: childData,
// //                 refresh: true,
// //             });
// //             console.log(`Child document indexed with ID: ${childId}, linked to parent: ${parentId}`);
// //         } catch (error) {
// //             console.error('Error indexing child document:', error);
// //             throw error;
// //         }
// //     }

// //     // **Fetch All Documents**
// //     async getAllDocuments() {
// //         try {
// //             const result = await this.esClient.search({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         match_all: {}, // Fetch all documents
// //                     },
// //                 },
// //             });
// //             return result.body.hits.hits;
// //         } catch (error) {
// //             console.error('Error fetching all documents:', error);
// //             throw error;
// //         }
// //     }

// //     // **Search Parent Documents with Specific Child Conditions**
// //     async searchParentWithChild(childType, query) {
// //         try {
// //             const result = await this.esClient.search({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         has_child: {
// //                             type: childType, // Specify the child type
// //                             query,
// //                         },
// //                     },
// //                 },
// //             });
// //             return result.body.hits.hits;
// //         } catch (error) {
// //             console.error('Error searching parent documents with child conditions:', error);
// //             throw error;
// //         }
// //     }

// //     // **Delete Plan and All Nested Elements**
// //     async deletePlan(planId) {
// //         try {
// //             // Delete all child documents linked to the parent
// //             await this.esClient.deleteByQuery({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         term: {
// //                             'plan.parent': planId, // Match all children linked to the parent
// //                         },
// //                     },
// //                 },
// //                 refresh: true,
// //             });

// //             // Delete the parent document
// //             await this.esClient.delete({
// //                 index: this.indexName,
// //                 id: planId,
// //                 refresh: true,
// //             });

// //             console.log(`Plan with ID ${planId} and its children deleted successfully.`);
// //         } catch (error) {
// //             console.error('Error deleting plan:', error);
// //             throw error;
// //         }
// //     }
// // }


// // import { Client } from '@elastic/elasticsearch';

// // export class ElasticSearchService {
// //     constructor(esClient) {
// //         this.esClient = esClient;
// //         this.indexName = process.env.ELASTICSEARCH_INDEX || 'healthcare_plans';
// //     }

// //     // **Initialize the Index with Parent-Child Relationship**
// //     async initializeIndex() {
// //         try {
// //             const indexExists = await this.esClient.indices.exists({ index: this.indexName });

// //             if (!indexExists.body) {
// //                 await this.esClient.indices.create({
// //                     index: this.indexName,
// //                     body: {
// //                         mappings: {
// //                             properties: {
// //                                 plan: {
// //                                     type: 'join',
// //                                     relations: {
// //                                         healthcarePlan: ['linkedPlanServices', 'planCostShares', 'planserviceCostShares', 'linkedService'], // Parent-Child relationships
// //                                     },
// //                                 },
// //                                 objectId: { type: 'keyword' },
// //                                 objectType: { type: 'keyword' },
// //                                 _org: { type: 'keyword' },
// //                                 creationDate: {
// //                                     type: 'date',
// //                                     format: 'dd-MM-yyyy||yyyy-MM-dd||strict_date_optional_time||epoch_millis',
// //                                 },
// //                                 planCostShares: {
// //                                     properties: {
// //                                         deductible: { type: 'integer' },
// //                                         copay: { type: 'integer' },
// //                                         objectId: { type: 'keyword' },
// //                                         _org: { type: 'keyword' },
// //                                     },
// //                                 },
// //                                 linkedPlanServices: {
// //                                     properties: {
// //                                         objectId: { type: 'keyword' },
// //                                         linkedService: {
// //                                             properties: {
// //                                                 objectId: { type: 'keyword' },
// //                                                 name: { type: 'text' },
// //                                             },
// //                                         },
// //                                     },
// //                                 },
// //                             },
// //                         },
// //                     },
// //                 });
// //                 console.log(`Elasticsearch index '${this.indexName}' created successfully.`);
// //             }
// //         } catch (error) {
// //             console.error('Error initializing Elasticsearch index:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Parent and All Nested Elements**
// //     async indexPlan(plan) {
// //         try {
// //             // Index the parent healthcarePlan
// //             await this.indexParent(plan);

// //             // Index planCostShares as a child of the parent healthcarePlan
// //             if (plan.planCostShares) {
// //                 await this.indexChild(
// //                     plan.planCostShares.objectId,
// //                     {
// //                         ...plan.planCostShares,
// //                         plan: {
// //                             name: 'planCostShares',
// //                             parent: plan.objectId,
// //                         },
// //                     },
// //                     plan.objectId
// //                 );
// //             }

// //             // Index linkedPlanServices and their nested elements
// //             if (plan.linkedPlanServices) {
// //                 for (const service of plan.linkedPlanServices) {
// //                     // Index linkedPlanServices as a child of healthcarePlan
// //                     await this.indexChild(
// //                         service.objectId,
// //                         {
// //                             ...service,
// //                             plan: {
// //                                 name: 'linkedPlanServices',
// //                                 parent: plan.objectId,
// //                             },
// //                         },
// //                         plan.objectId
// //                     );

// //                     // Index linkedService as a child of linkedPlanServices
// //                     if (service.linkedService) {
// //                         await this.indexChild(
// //                             service.linkedService.objectId,
// //                             {
// //                                 ...service.linkedService,
// //                                 plan: {
// //                                     name: 'linkedService',
// //                                     parent: service.objectId,
// //                                 },
// //                             },
// //                             service.objectId
// //                         );
// //                     }

// //                     // Index planserviceCostShares as a child of linkedPlanServices
// //                     if (service.planserviceCostShares) {
// //                         await this.indexChild(
// //                             service.planserviceCostShares.objectId,
// //                             {
// //                                 ...service.planserviceCostShares,
// //                                 plan: {
// //                                     name: 'planserviceCostShares',
// //                                     parent: service.objectId,
// //                                 },
// //                             },
// //                             service.objectId
// //                         );
// //                     }
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Error indexing plan:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Parent Document**
// //     async indexParent(parentData) {
// //         try {
// //             const parentDoc = {
// //                 ...parentData,
// //                 plan: 'healthcarePlan', // Add join metadata for the parent
// //             };

// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: parentData.objectId,
// //                 body: parentDoc,
// //                 refresh: true,
// //             });

// //             console.log(`Parent document indexed with ID: ${parentData.objectId}`);
// //         } catch (error) {
// //             console.error('Error indexing parent document:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Child Document**
// //     async indexChild(childId, childData, parentId) {
// //         try {
// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: childId,
// //                 routing: parentId, // Ensure routing to parent
// //                 body: childData,
// //                 refresh: true,
// //             });
// //             console.log(`Child document indexed with ID: ${childId}, linked to parent: ${parentId}`);
// //         } catch (error) {
// //             console.error('Error indexing child document:', error);
// //             throw error;
// //         }
// //     }

// //     // **Fetch All Documents**
// //     async getAllDocuments() {
// //         try {
// //             const result = await this.esClient.search({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         match_all: {}, // Fetch all documents
// //                     },
// //                 },
// //             });
// //             return result.body.hits.hits;
// //         } catch (error) {
// //             console.error('Error fetching all documents:', error);
// //             throw error;
// //         }
// //     }

// //     // **Search Parent Documents with Specific Child Conditions**
// //     async searchParentWithChild(childType, query) {
// //         try {
// //             const result = await this.esClient.search({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         has_child: {
// //                             type: childType, // Specify the child type
// //                             query,
// //                         },
// //                     },
// //                 },
// //             });
// //             return result.body.hits.hits;
// //         } catch (error) {
// //             console.error('Error searching parent documents with child conditions:', error);
// //             throw error;
// //         }
// //     }

// //     // **Delete Plan and All Nested Elements**
// //     async deletePlan(planId) {
// //         try {
// //             // Delete all child documents linked to the parent
// //             await this.esClient.deleteByQuery({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         term: {
// //                             'plan.parent': planId, // Match all children linked to the parent
// //                         },
// //                     },
// //                 },
// //                 refresh: true,
// //             });

// //             // Delete the parent document
// //             await this.esClient.delete({
// //                 index: this.indexName,
// //                 id: planId,
// //                 refresh: true,
// //             });

// //             console.log(`Plan with ID ${planId} and its children deleted successfully.`);
// //         } catch (error) {
// //             console.error('Error deleting plan:', error);
// //             throw error;
// //         }
// //     }
// // }

// // import { Client } from '@elastic/elasticsearch';

// // export class ElasticSearchService {
// //     constructor(esClient) {
// //         this.esClient = esClient;
// //         this.indexName = process.env.ELASTICSEARCH_INDEX || 'healthcare_plans';
// //     }

// //     // **Initialize the Index with Parent-Child Relationship**
// //     async initializeIndex() {
// //         try {
// //             const indexExists = await this.esClient.indices.exists({ index: this.indexName });

// //             if (!indexExists.body) {
// //                 await this.esClient.indices.create({
// //                     index: this.indexName,
// //                     body: {
// //                         mappings: {
// //                             properties: {
// //                                 plan: {
// //                                     type: 'join',
// //                                     relations: {
// //                                         healthcarePlan: ['linkedPlanServices', 'planCostShares', 'planserviceCostShares', 'linkedService'], // Define all relationships
// //                                     },
// //                                 },
// //                                 objectId: { type: 'keyword' },
// //                                 objectType: { type: 'keyword' },
// //                                 _org: { type: 'keyword' },
// //                                 creationDate: {
// //                                     type: 'date',
// //                                     format: 'dd-MM-yyyy||yyyy-MM-dd||strict_date_optional_time||epoch_millis',
// //                                 },
// //                                 linkedPlanServices: {
// //                                     properties: {
// //                                         objectId: { type: 'keyword' },
// //                                         linkedService: {
// //                                             properties: {
// //                                                 objectId: { type: 'keyword' },
// //                                                 name: { type: 'text' },
// //                                             },
// //                                         },
// //                                     },
// //                                 },
// //                                 planCostShares: {
// //                                     properties: {
// //                                         deductible: { type: 'integer' },
// //                                         copay: { type: 'integer' },
// //                                         objectId: { type: 'keyword' },
// //                                         _org: { type: 'keyword' },
// //                                     },
// //                                 },
// //                             },
// //                         },
// //                     },
// //                 });
// //                 console.log(`Elasticsearch index '${this.indexName}' created successfully.`);
// //             }
// //         } catch (error) {
// //             console.error('Error initializing Elasticsearch index:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Parent and Child Documents**
// //     async indexPlan(plan) {
// //         try {
// //             // Index the parent healthcarePlan
// //             await this.indexParent(plan);

// //             // Index planCostShares as a child of the parent healthcarePlan
// //             if (plan.planCostShares) {
// //                 await this.indexChild(
// //                     plan.planCostShares.objectId,
// //                     {
// //                         ...plan.planCostShares,
// //                         plan: {
// //                             name: 'planCostShares',
// //                             parent: plan.objectId,
// //                         },
// //                     },
// //                     plan.objectId
// //                 );
// //             }

// //             // Index linkedPlanServices and their nested elements
// //             if (plan.linkedPlanServices) {
// //                 for (const service of plan.linkedPlanServices) {
// //                     // Index linkedPlanServices as a child of healthcarePlan
// //                     await this.indexChild(
// //                         service.objectId,
// //                         {
// //                             ...service,
// //                             plan: {
// //                                 name: 'linkedPlanServices',
// //                                 parent: plan.objectId,
// //                             },
// //                         },
// //                         plan.objectId
// //                     );

// //                     // Index linkedService as a child of linkedPlanServices
// //                     if (service.linkedService) {
// //                         await this.indexChild(
// //                             service.linkedService.objectId,
// //                             {
// //                                 ...service.linkedService,
// //                                 plan: {
// //                                     name: 'linkedService',
// //                                     parent: service.objectId,
// //                                 },
// //                             },
// //                             service.objectId
// //                         );
// //                     }

// //                     // Index planserviceCostShares as a child of linkedPlanServices
// //                     if (service.planserviceCostShares) {
// //                         await this.indexChild(
// //                             service.planserviceCostShares.objectId,
// //                             {
// //                                 ...service.planserviceCostShares,
// //                                 plan: {
// //                                     name: 'planserviceCostShares',
// //                                     parent: service.objectId,
// //                                 },
// //                             },
// //                             service.objectId
// //                         );
// //                     }
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Error indexing plan:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Parent Document**
// //     async indexParent(parentData) {
// //         try {
// //             const parentDoc = {
// //                 ...parentData,
// //                 plan: 'healthcarePlan', // Add join metadata for the parent
// //             };

// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: parentData.objectId,
// //                 body: parentDoc,
// //                 refresh: true,
// //             });

// //             console.log(`Parent document indexed with ID: ${parentData.objectId}`);
// //         } catch (error) {
// //             console.error('Error indexing parent document:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Child Document**
// //     async indexChild(childId, childData, parentId) {
// //         try {
// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: childId,
// //                 routing: parentId, // Ensure routing to parent
// //                 body: childData,
// //                 refresh: true,
// //             });
// //             console.log(`Child document indexed with ID: ${childId}, linked to parent: ${parentId}`);
// //         } catch (error) {
// //             console.error('Error indexing child document:', error);
// //             throw error;
// //         }
// //     }

// //     // **Search Parent Documents by Child Conditions**
// //     async searchParentWithChild(childType, query) {
// //         try {
// //             const result = await this.esClient.search({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         has_child: {
// //                             type: childType,
// //                             query,
// //                         },
// //                     },
// //                 },
// //             });
// //             return result.body.hits.hits;
// //         } catch (error) {
// //             console.error('Error searching parent documents with child conditions:', error);
// //             throw error;
// //         }
// //     }

// //     // **Search Child Documents by Parent**
// //     async searchChildWithParent(parentId, childType) {
// //         try {
// //             const result = await this.esClient.search({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         has_parent: {
// //                             parent_type: childType,
// //                             query: {
// //                                 term: {
// //                                     _id: parentId,
// //                                 },
// //                             },
// //                         },
// //                     },
// //                 },
// //             });
// //             return result.body.hits.hits;
// //         } catch (error) {
// //             console.error('Error searching child documents by parent:', error);
// //             throw error;
// //         }
// //     }

// //     // **Delete Plan and All Nested Elements**
// //     async deletePlan(planId) {
// //         try {
// //             // Delete all child documents linked to the parent
// //             await this.esClient.deleteByQuery({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         term: {
// //                             'plan.parent': planId,
// //                         },
// //                     },
// //                 },
// //                 refresh: true,
// //             });

// //             // Delete the parent document
// //             await this.esClient.delete({
// //                 index: this.indexName,
// //                 id: planId,
// //                 refresh: true,
// //             });

// //             console.log(`Plan with ID ${planId} and its children deleted successfully.`);
// //         } catch (error) {
// //             console.error('Error deleting plan:', error);
// //             throw error;
// //         }
// //     }
// // }
// // import { Client } from '@elastic/elasticsearch';

// // export class ElasticSearchService {
// //     constructor(esClient) {
// //         this.esClient = esClient;
// //         this.indexName = process.env.ELASTICSEARCH_INDEX || 'healthcare_plans';
// //     }

// //     // **Initialize the Index with Parent-Child Relationship**
// //     async initializeIndex() {
// //         try {
// //             const indexExists = await this.esClient.indices.exists({ index: this.indexName });

// //             if (!indexExists.body) {
// //                 await this.esClient.indices.create({
// //                     index: this.indexName,
// //                     body: {
// //                         mappings: {
// //                             properties: {
// //                                 plan: {
// //                                     type: 'join',
// //                                     relations: {
// //                                         healthcarePlan: ['linkedPlanServices', 'planCostShares', 'planserviceCostShares', 'linkedService'], // Define all relationships
// //                                     },
// //                                 },
// //                                 objectId: { type: 'keyword' },
// //                                 objectType: { type: 'keyword' },
// //                                 _org: { type: 'keyword' },
// //                                 creationDate: {
// //                                     type: 'date',
// //                                     format: 'dd-MM-yyyy||yyyy-MM-dd||strict_date_optional_time||epoch_millis',
// //                                 },
// //                                 linkedPlanServices: {
// //                                     properties: {
// //                                         objectId: { type: 'keyword' },
// //                                         linkedService: {
// //                                             properties: {
// //                                                 objectId: { type: 'keyword' },
// //                                                 name: { type: 'text' },
// //                                             },
// //                                         },
// //                                     },
// //                                 },
// //                                 planCostShares: {
// //                                     properties: {
// //                                         deductible: { type: 'integer' },
// //                                         copay: { type: 'integer' },
// //                                         objectId: { type: 'keyword' },
// //                                         _org: { type: 'keyword' },
// //                                     },
// //                                 },
// //                             },
// //                         },
// //                     },
// //                 });
// //                 console.log(`Elasticsearch index '${this.indexName}' created successfully.`);
// //             }
// //         } catch (error) {
// //             console.error('Error initializing Elasticsearch index:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Parent and Child Documents**
// //     async indexPlan(plan) {
// //         try {
// //             // Index the parent healthcarePlan
// //             await this.indexParent(plan);

// //             // Index planCostShares as a child of the parent healthcarePlan
// //             if (plan.planCostShares) {
// //                 await this.indexChild(
// //                     plan.planCostShares.objectId,
// //                     {
// //                         ...plan.planCostShares,
// //                         plan: {
// //                             name: 'planCostShares',
// //                             parent: plan.objectId,
// //                         },
// //                     },
// //                     plan.objectId
// //                 );
// //             }

// //             // Index linkedPlanServices and their nested elements
// //             if (plan.linkedPlanServices) {
// //                 for (const service of plan.linkedPlanServices) {
// //                     // Index linkedPlanServices as a child of healthcarePlan
// //                     await this.indexChild(
// //                         service.objectId,
// //                         {
// //                             ...service,
// //                             plan: {
// //                                 name: 'linkedPlanServices',
// //                                 parent: plan.objectId,
// //                             },
// //                         },
// //                         plan.objectId
// //                     );

// //                     // Index linkedService as a child of linkedPlanServices
// //                     if (service.linkedService) {
// //                         await this.indexChild(
// //                             service.linkedService.objectId,
// //                             {
// //                                 ...service.linkedService,
// //                                 plan: {
// //                                     name: 'linkedService',
// //                                     parent: service.objectId,
// //                                 },
// //                             },
// //                             service.objectId
// //                         );
// //                     }

// //                     // Index planserviceCostShares as a child of linkedPlanServices
// //                     if (service.planserviceCostShares) {
// //                         await this.indexChild(
// //                             service.planserviceCostShares.objectId,
// //                             {
// //                                 ...service.planserviceCostShares,
// //                                 plan: {
// //                                     name: 'planserviceCostShares',
// //                                     parent: service.objectId,
// //                                 },
// //                             },
// //                             service.objectId
// //                         );
// //                     }
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Error indexing plan:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Parent Document**
// //     async indexParent(parentData) {
// //         try {
// //             const parentDoc = {
// //                 ...parentData,
// //                 plan: 'healthcarePlan', // Add join metadata for the parent
// //             };

// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: parentData.objectId,
// //                 body: parentDoc,
// //                 refresh: true,
// //             });

// //             console.log(`Parent document indexed with ID: ${parentData.objectId}`);
// //         } catch (error) {
// //             console.error('Error indexing parent document:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Child Document**
// //     async indexChild(childId, childData, parentId) {
// //         try {
// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: childId,
// //                 routing: parentId, // Ensure routing to parent
// //                 body: childData,
// //                 refresh: true,
// //             });
// //             console.log(`Child document indexed with ID: ${childId}, linked to parent: ${parentId}`);
// //         } catch (error) {
// //             console.error('Error indexing child document:', error);
// //             throw error;
// //         }
// //     }

// //     // **Search Parent Documents by Child Conditions**
// //     async searchParentWithChild(childType, query) {
// //         try {
// //             const result = await this.esClient.search({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         has_child: {
// //                             type: childType,
// //                             query,
// //                         },
// //                     },
// //                 },
// //             });
// //             return result.body.hits.hits;
// //         } catch (error) {
// //             console.error('Error searching parent documents with child conditions:', error);
// //             throw error;
// //         }
// //     }

// //     // **Search Child Documents by Parent**
// //     async searchChildWithParent(parentId, childType) {
// //         try {
// //             const result = await this.esClient.search({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         has_parent: {
// //                             parent_type: childType,
// //                             query: {
// //                                 term: {
// //                                     _id: parentId,
// //                                 },
// //                             },
// //                         },
// //                     },
// //                 },
// //             });
// //             return result.body.hits.hits;
// //         } catch (error) {
// //             console.error('Error searching child documents by parent:', error);
// //             throw error;
// //         }
// //     }

// //     async deletePlan(planId) {
// //         try {
// //             await this.esClient.deleteByQuery({
// //                 index: this.indexName,
// //                 body: {
// //                     query: { term: { 'plan.parent': planId } },
// //                 },
// //                 refresh: true,
// //             });

// //             await this.esClient.delete({
// //                 index: this.indexName,
// //                 id: planId,
// //                 refresh: true,
// //             });
// //         } catch (error) {
// //             console.error('Error deleting plan:', error);
// //             throw error;
// //         }
// //     }

//     // // **Delete Plan and All Nested Elements**
//     // async deletePlan(planId) {
//     //     try {
//     //         // Delete all child documents linked to the parent
//     //         await this.esClient.deleteByQuery({
//     //             index: this.indexName,
//     //             body: {
//     //                 query: {
//     //                     term: {
//     //                         'plan.parent': planId,
//     //                     },
//     //                 },
//     //             },
//     //             refresh: true,
//     //         });

//     //         // Delete the parent document
//     //         await this.esClient.delete({
//     //             index: this.indexName,
//     //             id: planId,
//     //             refresh: true,
//     //         });

//     //         console.log(`Plan with ID ${planId} and its children deleted successfully.`);
//     //     } catch (error) {
//     //         console.error('Error deleting plan:', error);
//     //         throw error;
//     //     }
//     // }

//     // **Delete Plan and All Nested Elements**
// // **Delete Plan and All Nested Elements**

// // **Delete Entire Plan and All Related Elements**
// // **Delete Entire Plan and Remove Index**
// // **Delete Entire Plan and All Related Documents**
// // **Delete Entire Plan and All Associated Documents**
// // async deletePlan(planId) {
// //     try {
// //         // Step 1: Delete all related documents (parent and children)
// //         await this.esClient.deleteByQuery({
// //             index: this.indexName,
// //             body: {
// //                 query: {
// //                     bool: {
// //                         should: [
// //                             { term: { _id: planId } }, // Delete parent document
// //                             { term: { 'plan.parent': planId } }, // Delete child documents
// //                         ],
// //                     },
// //                 },
// //             },
// //             refresh: true, // Ensure consistency
// //         });

// //         console.log(`Plan with ID ${planId} and all related documents deleted from Elasticsearch.`);

// //         // Step 2: Check if the index is empty
// //         const remainingDocs = await this.esClient.search({
// //             index: this.indexName,
// //             body: {
// //                 query: {
// //                     match_all: {}, // Query to check if the index has any remaining documents
// //                 },
// //             },
// //         });

// //         // Step 3: If the index is empty, delete the index itself
// //         if (remainingDocs.body.hits.total.value === 0) {
// //             await this.esClient.indices.delete({
// //                 index: this.indexName,
// //             });
// //             console.log(`Index '${this.indexName}' deleted as it is empty.`);
// //         }
// //     } catch (error) {
// //         console.error('Error deleting plan and related documents from Elasticsearch:', error);
// //         throw error;
// //     }
// // }
// // async deleteEntireIndex() {
// //     try {
// //         // Step 1: Check if the index exists
// //         const indexExists = await this.esClient.indices.exists({
// //             index: this.indexName,
// //         });

// //         if (indexExists.body) {
// //             // Step 2: Delete the index
// //             await this.esClient.indices.delete({
// //                 index: this.indexName,
// //             });
// //             console.log(`Index '${this.indexName}' and all associated plans deleted from Elasticsearch.`);
// //         } else {
// //             console.log(`Index '${this.indexName}' does not exist.`);
// //         }
// //     } catch (error) {
// //         console.error('Error deleting index from Elasticsearch:', error);
// //         throw error;
// //     }
// }
// // async deleteEntireIndex() {
// //     try {
// //         // Check if the index exists
// //         const indexExists = await this.esClient.indices.exists({
// //             index: this.indexName,
// //         });

// //         if (indexExists.body) {
// //             // Delete the index
// //             await this.esClient.indices.delete({
// //                 index: this.indexName,
// //             });
// //             console.log(`Index '${this.indexName}' and all associated documents deleted from Elasticsearch.`);
// //         } else {
// //             console.log(`Index '${this.indexName}' does not exist in Elasticsearch.`);
// //         }
// //     } catch (error) {
// //         console.error('Error deleting Elasticsearch index:', error);
// //         throw error;
// //     }
// // }


//     // async deleteChild(childId, parentId) {
//     //     try {
//     //         await this.esClient.delete({
//     //             index: this.indexName,
//     //             id: childId,
//     //             routing: parentId, // Ensure proper routing to the parent
//     //             refresh: true,
//     //         });
//     //         console.log(`Child document with ID ${childId} linked to parent ${parentId} deleted from Elasticsearch.`);
//     //     } catch (error) {
//     //         console.error(`Error deleting child document with ID ${childId}:`, error);
//     //         throw error;
//     //     }
//     // }
    


// // /3.-
// // import { Client } from '@elastic/elasticsearch';

// // export class ElasticSearchService {
// //     constructor(esClient) {
// //         this.esClient = esClient;
// //         this.indexName = process.env.ELASTICSEARCH_INDEX || 'healthcare_plans';
// //     }

// //     // **Initialize the Index with Parent-Child Relationship**
// //     async initializeIndex() {
// //         try {
// //             const indexExists = await this.esClient.indices.exists({ index: this.indexName });

// //             if (!indexExists.body) {
// //                 await this.esClient.indices.create({
// //                     index: this.indexName,
// //                     body: {
// //                         mappings: {
// //                             properties: {
// //                                 plan: {
// //                                     type: 'join',
// //                                     relations: {
// //                                         healthcarePlan: ['linkedPlanServices', 'planCostShares', 'planserviceCostShares', 'linkedService'], // Define all relationships
// //                                     },
// //                                 },
// //                                 objectId: { type: 'keyword' },
// //                                 objectType: { type: 'keyword' },
// //                                 _org: { type: 'keyword' },
// //                                 creationDate: {
// //                                     type: 'date',
// //                                     format: 'dd-MM-yyyy||yyyy-MM-dd||strict_date_optional_time||epoch_millis',
// //                                 },
// //                                 copay: { type: 'integer' }, // Ensure copay is indexed properly
// //                                 deductible: { type: 'integer' },
// //                             },
// //                         },
// //                     },
// //                 });
// //                 console.log(`Elasticsearch index '${this.indexName}' created successfully.`);
// //             }
// //         } catch (error) {
// //             console.error('Error initializing Elasticsearch index:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Parent and Child Documents**
// //     async indexPlan(plan) {
// //         try {
// //             // Index the parent healthcarePlan
// //             await this.indexParent(plan);

// //             // Index planCostShares as a child of the parent healthcarePlan
// //             if (plan.planCostShares) {
// //                 await this.indexChild(
// //                     plan.planCostShares.objectId,
// //                     {
// //                         ...plan.planCostShares,
// //                         plan: {
// //                             name: 'planCostShares',
// //                             parent: plan.objectId,
// //                         },
// //                     },
// //                     plan.objectId
// //                 );
// //             }

// //             // Index linkedPlanServices and their nested elements
// //             if (plan.linkedPlanServices) {
// //                 for (const service of plan.linkedPlanServices) {
// //                     // Index linkedPlanServices as a child of healthcarePlan
// //                     await this.indexChild(
// //                         service.objectId,
// //                         {
// //                             ...service,
// //                             plan: {
// //                                 name: 'linkedPlanServices',
// //                                 parent: plan.objectId,
// //                             },
// //                         },
// //                         plan.objectId
// //                     );

// //                     // Index linkedService as a child of linkedPlanServices
// //                     if (service.linkedService) {
// //                         await this.indexChild(
// //                             service.linkedService.objectId,
// //                             {
// //                                 ...service.linkedService,
// //                                 plan: {
// //                                     name: 'linkedService',
// //                                     parent: service.objectId,
// //                                 },
// //                             },
// //                             service.objectId
// //                         );
// //                     }

// //                     // Index planserviceCostShares as a child of linkedPlanServices
// //                     if (service.planserviceCostShares) {
// //                         await this.indexChild(
// //                             service.planserviceCostShares.objectId,
// //                             {
// //                                 ...service.planserviceCostShares,
// //                                 plan: {
// //                                     name: 'planserviceCostShares',
// //                                     parent: service.objectId,
// //                                 },
// //                             },
// //                             service.objectId
// //                         );
// //                     }
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Error indexing plan:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Parent Document**
// //     async indexParent(parentData) {
// //         try {
// //             const parentDoc = {
// //                 ...parentData,
// //                 plan: 'healthcarePlan', // Add join metadata for the parent
// //             };

// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: parentData.objectId,
// //                 body: parentDoc,
// //                 refresh: true,
// //             });

// //             console.log(`Parent document indexed with ID: ${parentData.objectId}`);
// //         } catch (error) {
// //             console.error('Error indexing parent document:', error);
// //             throw error;
// //         }
// //     }

// //     // **Index Child Document**
// //     async indexChild(childId, childData, parentId) {
// //         try {
// //             await this.esClient.index({
// //                 index: this.indexName,
// //                 id: childId,
// //                 routing: parentId, // Ensure routing to parent
// //                 body: childData,
// //                 refresh: true,
// //             });
// //             console.log(`Child document indexed with ID: ${childId}, linked to parent: ${parentId}`);
// //         } catch (error) {
// //             console.error('Error indexing child document:', error);
// //             throw error;
// //         }
// //     }

// //     // **Search Parent Documents by Child Conditions**
// //     async searchParentWithChildCondition(childType, query) {
// //         try {
// //             const result = await this.esClient.search({
// //                 index: this.indexName,
// //                 body: {
// //                     query: {
// //                         has_child: {
// //                             type: childType,
// //                             query,
// //                         },
// //                     },
// //                 },
// //             });
// //             return result.body.hits.hits;
// //         } catch (error) {
// //             console.error('Error searching parent documents with child conditions:', error);
// //             throw error;
// //         }
// //     }
// // }

import { Client } from '@elastic/elasticsearch';

export class ElasticSearchService {
    constructor(esClient) {
        this.esClient = esClient;
        this.indexName = process.env.ELASTICSEARCH_INDEX || 'plans';
    }

    // **Initialize the Index**
    async initializeIndex() {
        try {
            const indexExists = await this.esClient.indices.exists({ index: this.indexName });

            if (!indexExists.body) {
                await this.esClient.indices.create({
                    index: this.indexName,
                    body: {
                        mappings: {
                            properties: {
                                relation: {
                                    type: 'join',
                                    relations: {
                                        plan: ['planCostShares', 'linkedPlanServices'],
                                        linkedPlanServices: ['linkedService', 'planServiceCostShares'],
                                        planCostShares: [],
                                        linkedService: [],
                                        planServiceCostShares: [],
                                    },
                                },
                                _org: { type: 'text' },
                                objectId: { type: 'text' },
                                objectType: { type: 'text' },
                                planType: { type: 'text' },
                                creationDate: { type: 'text' },
                            },
                        },
                    },
                });
                console.log(`Index '${this.indexName}' created successfully.`);
            }
        } catch (error) {
            console.error('Error initializing index:', error);
            throw error;
        }
    }

    // **Index Parent and Child Documents**
    async indexPlan(plan) {
        try {
            // Index the parent plan
            await this.indexParent(plan);

            // Index planCostShares
            if (plan.planCostShares) {
                await this.indexChild(
                    plan.planCostShares.objectId,
                    {
                        ...plan.planCostShares,
                        relation: {
                            name: 'planCostShares',
                            parent: plan.objectId,
                        },
                    },
                    plan.objectId
                );
            }

            // Index linkedPlanServices and their nested elements
            if (plan.linkedPlanServices) {
                for (const service of plan.linkedPlanServices) {
                    // Index linkedPlanServices
                    await this.indexChild(
                        service.objectId,
                        {
                            ...service,
                            relation: {
                                name: 'linkedPlanServices',
                                parent: plan.objectId,
                            },
                        },
                        plan.objectId
                    );

                    // Index linkedService
                    if (service.linkedService) {
                        await this.indexChild(
                            service.linkedService.objectId,
                            {
                                ...service.linkedService,
                                relation: {
                                    name: 'linkedService',
                                    parent: service.objectId,
                                },
                            },
                            service.objectId
                        );
                    }

                    // Index planServiceCostShares
                    if (service.planserviceCostShares) {
                        await this.indexChild(
                            service.planserviceCostShares.objectId,
                            {
                                ...service.planserviceCostShares,
                                relation: {
                                    name: 'planServiceCostShares',
                                    parent: service.objectId,
                                },
                            },
                            service.objectId
                        );
                    }
                }
            }
        } catch (error) {
            console.error('Error indexing plan:', error);
            throw error;
        }
    }

    // **Index Parent Document**
    async indexParent(parentData) {
        try {
            const parentDoc = {
                _org: parentData._org,
                creationDate: parentData.creationDate,
                objectId: parentData.objectId,
                objectType: parentData.objectType,
                planType: parentData.planType,
                relation: 'plan',
            };

            await this.esClient.index({
                index: this.indexName,
                id: parentData.objectId,
                body: parentDoc,
                refresh: true,
            });

            console.log(`Parent document indexed with ID: ${parentData.objectId}`);
        } catch (error) {
            console.error('Error indexing parent document:', error);
            throw error;
        }
    }

    // **Index Child Document**
    async indexChild(childId, childData, parentId) {
        try {
            await this.esClient.index({
                index: this.indexName,
                id: childId,
                routing: parentId, // Ensures the child is linked to the parent
                body: childData,
                refresh: true,
            });
            console.log(`Child document indexed with ID: ${childId}, linked to parent: ${parentId}`);
        } catch (error) {
            console.error('Error indexing child document:', error);
            throw error;
        }
    }

    // **Search All Documents**
    async searchAllPlans() {
        try {
            const result = await this.esClient.search({
                index: this.indexName,
                body: {
                    query: {
                        match_all: {},
                    },
                },
            });
            return result.body.hits;
        } catch (error) {
            console.error('Error searching all plans:', error);
            throw error;
        }
    }

    // // **Delete Entire Plan and Its Children**
    // async deletePlan(planId) {
    //     try {
    //         // Delete all child documents
    //         await this.esClient.deleteByQuery({
    //             index: this.indexName,
    //             body: {
    //                 query: {
    //                     parent_id: {
    //                         type: 'plan',
    //                         id: planId,
    //                     },
    //                 },
    //             },
    //             refresh: true,
    //         });

    //         // Delete the parent document
    //         await this.esClient.delete({
    //             index: this.indexName,
    //             id: planId,
    //             refresh: true,
    //         });

    //         console.log(`Plan with ID ${planId} and its children deleted successfully.`);
    //     } catch (error) {
    //         console.error('Error deleting plan:', error);
    //         throw error;
    //     }
    // }
    // async deleteCompletePlan(planId) {
    //     try {
    //         // Recursively fetch all child documents linked to the plan
    //         const documentsToDelete = await this.fetchAllRelatedDocuments(planId);

    //         // Delete all related documents (including the parent)
    //         for (const doc of documentsToDelete) {
    //             await this.esClient.delete({
    //                 index: this.indexName,
    //                 id: doc._id,
    //                 refresh: true // Ensure deletion is visible immediately
    //             });
    //         }

    //         console.log(`Plan with ID ${planId} and all related documents deleted successfully.`);
    //     } catch (error) {
    //         console.error(`Error deleting plan with ID ${planId}:`, error);
    //         throw error;
    //     }
    // }

    // // **Fetch All Related Documents Recursively**
    // async fetchAllRelatedDocuments(parentId) {
    //     try {
    //         const results = [];
    //         const fetchChildren = async (id) => {
    //             const response = await this.esClient.search({
    //                 index: this.indexName,
    //                 body: {
    //                     query: {
    //                         term: {
    //                             'relation.parent': id
    //                         }
    //                     }
    //                 }
    //             });

    //             const hits = response.body.hits.hits;

    //             // Add children to results
    //             results.push(...hits);

    //             // Recursively fetch children of children
    //             for (const hit of hits) {
    //                 await fetchChildren(hit._id);
    //             }
    //         };

    //         // Start with the parent document
    //         results.push({ _id: parentId });
    //         await fetchChildren(parentId);

    //         return results;
    //     } catch (error) {
    //         console.error(`Error fetching related documents for ID ${parentId}:`, error);
    //         throw error;
    //     }
    // }

    // async deleteCompletePlanAndIndex(parentID) {
    //     try {
    //         // Recursively delete all descendants
    //         await this.deleteDescendants(this.indexName, parentID, 'planCostShares');
    //         await this.deleteDescendants(this.indexName, parentID, 'linkedPlanServices');
    
    //         // Delete the parent document
    //         await this.deleteFromElasticsearch(this.indexName, parentID);
    
    //         // Delete the Elasticsearch index
    //         await this.deleteIndex(this.indexName);
    
    //         console.log(`Successfully deleted plan ${parentID}, all descendants, and the index.`);
    //     } catch (error) {
    //         console.error(`Error deleting plan ${parentID} and its index: ${error.message}`);
    //         throw error;
    //     }
    // }
    // async deleteDescendants(index, parentID, childType) {
    //     try {
    //         const searchQuery = {
    //             query: {
    //                 parent_id: {
    //                     type: childType,
    //                     id: parentID,
    //                 },
    //             },
    //         };
    
    //         const searchResponse = await this.esClient.search({
    //             index,
    //             body: searchQuery,
    //         });
    
    //         const hits = searchResponse?.body?.hits?.hits;
    //         if (!hits || hits.length === 0) {
    //             console.log(`No descendants found for parentID ${parentID}, childType ${childType}.`);
    //             return;
    //         }
    
    //         for (const hit of hits) {
    //             const childID = hit._id;
    
    //             if (childType === 'linkedPlanServices') {
    //                 // Recursively delete linkedService and planServiceCostShares
    //                 await this.deleteDescendants(index, childID, 'linkedService');
    //                 await this.deleteDescendants(index, childID, 'planServiceCostShares');
    //             }
    
    //             // Delete the child document
    //             await this.deleteFromElasticsearch(index, childID);
    //         }
    //     } catch (error) {
    //         console.error(`Error deleting descendants for parentID ${parentID}, childType ${childType}: ${error.message}`);
    //         throw error;
    //     }
    // }
    // async deleteFromElasticsearch(index, docID) {
    //     try {
    //         const response = await this.esClient.delete({
    //             index,
    //             id: docID,
    //             refresh: true,
    //         });
    
    //         if (response?.body?.result !== 'deleted') {
    //             throw new Error(`Failed to delete document ${docID} from index ${index}.`);
    //         }
    
    //         console.log(`Document deleted from Elasticsearch index: ${index}, ID: ${docID}`);
    //     } catch (error) {
    //         console.error(`Error deleting document ${docID}: ${error.message}`);
    //         throw error;
    //     }
    // }
    // async deleteIndex(index) {
    //     try {
    //         const response = await this.esClient.indices.delete({
    //             index,
    //         });
    
    //         if (response.acknowledged) {
    //             console.log(`Index ${index} deleted successfully.`);
    //         } else {
    //             throw new Error(`Failed to delete index ${index}.`);
    //         }
    //     } catch (error) {
    //         console.error(`Error deleting index ${index}: ${error.message}`);
    //         throw error;
    //     }
    // }
              
    async deleteCompletePlanAndIndex(parentID) {
        try {
            // Recursively delete all descendants
            await this.deleteDescendants(this.indexName, parentID, 'planCostShares');
            await this.deleteDescendants(this.indexName, parentID, 'linkedPlanServices');
    
            // Delete the parent document
            await this.deleteFromElasticsearch(this.indexName, parentID);
    
            // Optionally delete the index if needed
            await this.deleteIndex(this.indexName);
    
            console.log(`Successfully deleted plan ${parentID}, all descendants, and the index.`);
        } catch (error) {
            console.error(`Error deleting plan ${parentID} and its index: ${error.message}`);
            throw error;
        }
    }
    async deleteDescendants(index, parentID, childType) {
        try {
            const searchQuery = {
                query: {
                    parent_id: {
                        type: childType,
                        id: parentID,
                    },
                },
            };
    
            const searchResponse = await this.esClient.search({
                index,
                body: searchQuery,
            });
    
            const hits = searchResponse?.body?.hits?.hits;
            if (!hits || hits.length === 0) {
                console.log(`No descendants found for parentID ${parentID}, childType ${childType}.`);
                return;
            }
    
            for (const hit of hits) {
                const childID = hit._id;
    
                // If childType is "linkedPlanServices", recurse for its descendants
                if (childType === 'linkedPlanServices') {
                    await this.deleteDescendants(index, childID, 'linkedService');
                    await this.deleteDescendants(index, childID, 'planServiceCostShares');
                }
    
                // Delete the child document
                await this.deleteFromElasticsearch(index, childID);
            }
        } catch (error) {
            console.error(`Error deleting descendants for parentID ${parentID}, childType ${childType}: ${error.message}`);
            throw error;
        }
    }
    async deleteFromElasticsearch(index, docID) {
        try {
            const response = await this.esClient.delete({
                index,
                id: docID,
                refresh: true,
            });
    
            if (response?.body?.result !== 'deleted') {
                throw new Error(`Failed to delete document ${docID} from index ${index}.`);
            }
    
            console.log(`Document deleted from Elasticsearch index: ${index}, ID: ${docID}`);
        } catch (error) {
            console.error(`Error deleting document ${docID}: ${error.message}`);
            throw error;
        }
    }
    async deleteIndex(index) {
        try {
            const response = await this.esClient.indices.delete({
                index,
            });
    
            if (response.acknowledged) {
                console.log(`Index ${index} deleted successfully.`);
            } else {
                throw new Error(`Failed to delete index ${index}.`);
            }
        } catch (error) {
            console.error(`Error deleting index ${index}: ${error.message}`);
            throw error;
        }
    }
        
    // **Update Plan**
    async updatePlan(planId, updates) {
        try {
            await this.esClient.update({
                index: this.indexName,
                id: planId,
                body: {
                    doc: updates,
                },
                refresh: true,
            });

            console.log(`Plan with ID ${planId} updated successfully.`);
        } catch (error) {
            console.error('Error updating plan:', error);
            throw error;
        }
    }
}
