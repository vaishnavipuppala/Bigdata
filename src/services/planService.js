// // import crypto from 'crypto';

// // const generateEtag = (data) => {
// //   return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
// // };

// // const normalizeEtag = (etag) => {
// //   if (!etag) return null;
// //   return etag.replace(/^W\//, '').replace(/^"(.*)"$/, '$1');
// // };

// // const deepMerge = (target, source) => {
// //   const isObject = (obj) => obj && typeof obj === 'object' && !Array.isArray(obj);
  
// //   if (!isObject(target) || !isObject(source)) {
// //     return source;
// //   }

// //   const merged = { ...target };
  
// //   Object.keys(source).forEach(key => {
// //     if (isObject(source[key])) {
// //       if (!(key in target)) {
// //         Object.assign(merged, { [key]: source[key] });
// //       } else {
// //         merged[key] = deepMerge(target[key], source[key]);
// //       }
// //     } else if (Array.isArray(source[key])) {
// //       // Special handling for linkedPlanServices array
// //       if (key === 'linkedPlanServices') {
// //         const existingServices = (target[key] || []);
// //         const newServices = source[key];
        
// //         // Create a map of existing services by objectId for quick lookup
// //         const existingServiceMap = new Map(
// //           existingServices.map(service => [service.objectId, service])
// //         );
        
// //         // Process each new service
// //         newServices.forEach(newService => {
// //           if (existingServiceMap.has(newService.objectId)) {
// //             // If service exists, merge it with the new data
// //             const existingService = existingServiceMap.get(newService.objectId);
// //             existingServiceMap.set(
// //               newService.objectId, 
// //               deepMerge(existingService, newService)
// //             );
// //           } else {
// //             // If service doesn't exist, add it to the map
// //             existingServiceMap.set(newService.objectId, newService);
// //           }
// //         });
        
// //         // Convert map back to array
// //         merged[key] = Array.from(existingServiceMap.values());
// //       } else {
// //         // For other arrays, use the source array
// //         merged[key] = source[key];
// //       }
// //     } else {
// //       Object.assign(merged, { [key]: source[key] });
// //     }
// //   });
  
// //   return merged;
// // };

// // export const createPlan = async (redisClient, plan) => {
// //   const { objectId } = plan;
// //   if (!objectId) {
// //     throw new Error('Plan must have an objectId');
// //   }

// //   const existingPlan = await redisClient.hget("plans", objectId);
// //   if (existingPlan) {
// //     const error = new Error('Plan with this objectId already exists');
// //     error.statusCode = 409;
// //     throw error;
// //   }

// //   const etag = generateEtag(plan);
// //   const timestamp = new Date().toISOString();

// //   await redisClient.hset("plans", objectId, JSON.stringify({
// //     data: plan,
// //     etag,
// //     lastModified: timestamp
// //   }));

// //   return { plan, etag, lastModified: timestamp };
// // };

// // export const getPlan = async (redisClient, id, headers = {}) => {
// //   const { 'if-none-match': ifNoneMatch, 'if-match': ifMatch } = headers;
// //   console.log('Getting plan:', { id, ifNoneMatch, ifMatch });

// //   const stored = await redisClient.hget("plans", id);
// //   if (!stored) {
// //     return { status: 404 };
// //   }

// //   const { data: plan, etag: currentEtag, lastModified } = JSON.parse(stored);

// //   // Handle If-None-Match (return 304 if matches)
// //   if (ifNoneMatch) {
// //     const normalizedIfNoneMatch = normalizeEtag(ifNoneMatch);
// //     const normalizedCurrentEtag = normalizeEtag(currentEtag);
    
// //     if (normalizedIfNoneMatch === normalizedCurrentEtag) {
// //       return { 
// //         status: 304, 
// //         etag: currentEtag, 
// //         lastModified 
// //       };
// //     }
// //   }

// //   // Handle If-Match (return 412 if doesn't match)
// //   if (ifMatch) {
// //     const normalizedIfMatch = normalizeEtag(ifMatch);
// //     const normalizedCurrentEtag = normalizeEtag(currentEtag);
    
// //     if (normalizedIfMatch !== normalizedCurrentEtag) {
// //       return { status: 412 };
// //     }
// //   }

// //   return { 
// //     status: 200, 
// //     plan, 
// //     etag: currentEtag, 
// //     lastModified 
// //   };
// // };

// // export const updatePlan = async (redisClient, id, updates, headers = {}) => {
// //   const { 'if-match': ifMatch, 'if-none-match': ifNoneMatch } = headers;
// //   console.log('Updating plan:', { id, ifMatch, ifNoneMatch });

// //   const stored = await redisClient.hget("plans", id);
// //   if (!stored) {
// //     return { status: 404 };
// //   }

// //   const { data: currentPlan, etag: currentEtag } = JSON.parse(stored);

// //   if (ifMatch) {
// //     const normalizedIfMatch = normalizeEtag(ifMatch);
// //     const normalizedCurrentEtag = normalizeEtag(currentEtag);
    
// //     if (normalizedIfMatch !== normalizedCurrentEtag) {
// //       return { 
// //         status: 412,
// //         message: 'Plan has been modified since last retrieval'
// //       };
// //     }
// //   }

// //   if (ifNoneMatch) {
// //     const normalizedIfNoneMatch = normalizeEtag(ifNoneMatch);
// //     const normalizedCurrentEtag = normalizeEtag(currentEtag);
    
// //     if (normalizedIfNoneMatch === normalizedCurrentEtag) {
// //       return { 
// //         status: 412,
// //         message: 'Plan matches specified version'
// //       };
// //     }
// //   }

// //   const timestamp = new Date().toISOString();
// //   const newEtag = generateEtag(updates);

// //   await redisClient.hset("plans", id, JSON.stringify({
// //     data: updates,
// //     etag: newEtag,
// //     lastModified: timestamp
// //   }));

// //   return { 
// //     status: 200, 
// //     plan: updates, 
// //     etag: newEtag,
// //     lastModified: timestamp 
// //   };
// // };

// // export const patchPlan = async (redisClient, id, updates, headers = {}) => {
// //   const { 'if-match': ifMatch, 'if-none-match': ifNoneMatch } = headers;
// //   console.log('Patching plan:', { id, ifMatch, ifNoneMatch });

// //   const stored = await redisClient.hget("plans", id);
// //   if (!stored) {
// //     return { status: 404 };
// //   }

// //   const { data: currentPlan, etag: currentEtag } = JSON.parse(stored);

// //   if (ifMatch) {
// //     const normalizedIfMatch = normalizeEtag(ifMatch);
// //     const normalizedCurrentEtag = normalizeEtag(currentEtag);
    
// //     if (normalizedIfMatch !== normalizedCurrentEtag) {
// //       return { 
// //         status: 412,
// //         message: 'Plan has been modified since last retrieval'
// //       };
// //     }
// //   }

// //   if (ifNoneMatch) {
// //     const normalizedIfNoneMatch = normalizeEtag(ifNoneMatch);
// //     const normalizedCurrentEtag = normalizeEtag(currentEtag);
    
// //     if (normalizedIfNoneMatch === normalizedCurrentEtag) {
// //       return { 
// //         status: 412,
// //         message: 'Plan matches specified version'
// //       };
// //     }
// //   }

// //   const patchedPlan = deepMerge(currentPlan, updates);
// //   const timestamp = new Date().toISOString();
// //   const newEtag = generateEtag(patchedPlan);

// //   await redisClient.hset("plans", id, JSON.stringify({
// //     data: patchedPlan,
// //     etag: newEtag,
// //     lastModified: timestamp
// //   }));

// //   return { 
// //     status: 200, 
// //     plan: patchedPlan, 
// //     etag: newEtag,
// //     lastModified: timestamp 
// //   };
// // };

// // export const deletePlan = async (redisClient, id, headers = {}) => {
// //   const { 'if-match': ifMatch } = headers;
// //   console.log('Deleting plan:', { id, ifMatch });

// //   const stored = await redisClient.hget("plans", id);
// //   if (!stored) {
// //     return { status: 404 };
// //   }

// //   const { etag: currentEtag } = JSON.parse(stored);

// //   if (ifMatch) {
// //     const normalizedIfMatch = normalizeEtag(ifMatch);
// //     const normalizedCurrentEtag = normalizeEtag(currentEtag);
    
// //     if (normalizedIfMatch !== normalizedCurrentEtag) {
// //       return { 
// //         status: 412,
// //         message: 'Plan has been modified since last retrieval'
// //       };
// //     }
// //   }

// //   const result = await redisClient.hdel("plans", id);
// //   return { status: result === 1 ? 204 : 404 };
// // };
// // import crypto from 'crypto';
// // import { ElasticSearchService } from './elasticSearchService.js';

// // export class PlanService {
// //   static generateEtag(data) {
// //     return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
// //   }

// //   static normalizeEtag(etag) {
// //     if (!etag) return null;
// //     return etag.replace(/^W\//, '').replace(/^"(.*)"$/, '$1');
// //   }

// //   static async createPlan(redisClient, esClient, mqClient, plan) {
// //     if (!plan.objectId) {
// //       throw new Error('Plan must have an objectId');
// //     }

// //     // Add creation date if not provided
// //     if (!plan.creationDate) {
// //       plan.creationDate = new Date().toISOString();
// //     }

// //     const existingPlan = await redisClient.hget("plans", plan.objectId);
// //     if (existingPlan) {
// //       const error = new Error('Plan with this objectId already exists');
// //       error.statusCode = 409;
// //       throw error;
// //     }

// //     const etag = this.generateEtag(plan);
// //     const timestamp = new Date().toISOString();

// //     try {
// //       // Store in Redis
// //       await redisClient.hset("plans", plan.objectId, JSON.stringify({
// //         data: plan,
// //         etag,
// //         lastModified: timestamp
// //       }));

// //       // Queue for Elasticsearch indexing
// //       await mqClient.publishMessage(mqClient.queues.CREATE, {
// //         action: 'CREATE',
// //         timestamp,
// //         plan
// //       });

// //       return { plan, etag, lastModified: timestamp };
// //     } catch (error) {
// //       await redisClient.hdel("plans", plan.objectId);
// //       throw error;
// //     }
// //   }

// //   static async getPlan(redisClient, id, headers = {}) {
// //     const { 'if-none-match': ifNoneMatch, 'if-match': ifMatch } = headers;
    
// //     const stored = await redisClient.hget("plans", id);
// //     if (!stored) return { status: 404 };

// //     const { data: plan, etag, lastModified } = JSON.parse(stored);

// //     if (ifMatch && this.normalizeEtag(ifMatch) !== this.normalizeEtag(etag)) {
// //       return { status: 412 };
// //     }

// //     if (ifNoneMatch && this.normalizeEtag(ifNoneMatch) === this.normalizeEtag(etag)) {
// //       return { status: 304, etag, lastModified };
// //     }

// //     return { status: 200, plan, etag, lastModified };
// //   }

// //   static async updatePlan(redisClient, esClient, mqClient, id, updates, headers = {}) {
// //     const { 'if-match': ifMatch } = headers;
    
// //     const stored = await redisClient.hget("plans", id);
// //     if (!stored) return { status: 404 };

// //     const { data: currentPlan, etag: currentEtag } = JSON.parse(stored);

// //     if (ifMatch && this.normalizeEtag(ifMatch) !== this.normalizeEtag(currentEtag)) {
// //       return { status: 412 };
// //     }

// //     const updatedPlan = { ...currentPlan, ...updates };
// //     const newEtag = this.generateEtag(updatedPlan);
// //     const timestamp = new Date().toISOString();

// //     try {
// //       await redisClient.hset("plans", id, JSON.stringify({
// //         data: updatedPlan,
// //         etag: newEtag,
// //         lastModified: timestamp
// //       }));

// //       await mqClient.publishMessage(mqClient.queues.UPDATE, {
// //         action: 'UPDATE',
// //         timestamp,
// //         plan: updatedPlan
// //       });

// //       return { 
// //         status: 200, 
// //         plan: updatedPlan, 
// //         etag: newEtag,
// //         lastModified: timestamp 
// //       };
// //     } catch (error) {
// //       if (stored) {
// //         await redisClient.hset("plans", id, stored);
// //       }
// //       throw error;
// //     }
// //   }

// //   static async deletePlan(redisClient, esClient, mqClient, id, headers = {}) {
// //     const { 'if-match': ifMatch } = headers;
    
// //     const stored = await redisClient.hget("plans", id);
// //     if (!stored) return { status: 404 };

// //     const { etag: currentEtag } = JSON.parse(stored);

// //     if (ifMatch && this.normalizeEtag(ifMatch) !== this.normalizeEtag(currentEtag)) {
// //       return { status: 412 };
// //     }

// //     try {
// //       await redisClient.hdel("plans", id);
      
// //       await mqClient.publishMessage(mqClient.queues.DELETE, {
// //         action: 'DELETE',
// //         timestamp: new Date().toISOString(),
// //         planId: id
// //       });

// //       return { status: 204 };
// //     } catch (error) {
// //       console.error('Delete operation failed:', error);
// //       throw error;
// //     }
// //   }

// //   static async searchPlans(esClient, query) {
// //     return ElasticSearchService.searchPlans(query);
// //   }
// // }

// import crypto from 'crypto';

// export class PlanService {
//   constructor(redisClient, esService, mqService) {
//     this.redisClient = redisClient;
//     this.esService = esService;
//     this.mqService = mqService;
//   }

//   generateEtag(data) {
//     return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
//   }

//   async createPlan(plan) {
//     if (!plan.objectId) {
//       throw new Error('Plan must have an objectId');
//     }

//     const existingPlan = await this.redisClient.hget("plans", plan.objectId);
//     if (existingPlan) {
//       const error = new Error('Plan with this objectId already exists');
//       error.statusCode = 409;
//       throw error;
//     }

//     const etag = this.generateEtag(plan);
//     const timestamp = new Date().toISOString();

//     try {
//       // Store in Redis
//       await this.redisClient.hset("plans", plan.objectId, JSON.stringify({
//         data: plan,
//         etag,
//         lastModified: timestamp
//       }));

//       // Queue for processing
//       await this.mqService.publishMessage(this.mqService.queues.CREATE, {
//         operation: 'CREATE',
//         plan,
//         timestamp
//       });

//       return { plan, etag, lastModified: timestamp };
//     } catch (error) {
//       // Rollback Redis if queueing fails
//       await this.redisClient.hdel("plans", plan.objectId);
//       throw error;
//     }
//   }

//   async updatePlan(id, updates, headers = {}) {
//     const { 'if-match': ifMatch } = headers;
    
//     const stored = await this.redisClient.hget("plans", id);
//     if (!stored) return { status: 404 };

//     const { data: currentPlan, etag: currentEtag } = JSON.parse(stored);

//     if (ifMatch && ifMatch !== currentEtag) {
//       return { status: 412 };
//     }

//     const updatedPlan = { ...currentPlan, ...updates };
//     const newEtag = this.generateEtag(updatedPlan);
//     const timestamp = new Date().toISOString();

//     try {
//       await this.redisClient.hset("plans", id, JSON.stringify({
//         data: updatedPlan,
//         etag: newEtag,
//         lastModified: timestamp
//       }));

//       await this.mqService.publishMessage(this.mqService.queues.UPDATE, {
//         operation: 'UPDATE',
//         plan: updatedPlan,
//         timestamp
//       });

//       return {
//         status: 200,
//         plan: updatedPlan,
//         etag: newEtag,
//         lastModified: timestamp
//       };
//     } catch (error) {
//       // Rollback on error
//       if (stored) {
//         await this.redisClient.hset("plans", id, stored);
//       }
//       throw error;
//     }
//   }

//   async deletePlan(id, headers = {}) {
//     const { 'if-match': ifMatch } = headers;
    
//     const stored = await this.redisClient.hget("plans", id);
//     if (!stored) return { status: 404 };

//     const { etag: currentEtag } = JSON.parse(stored);

//     if (ifMatch && ifMatch !== currentEtag) {
//       return { status: 412 };
//     }

//     try {
//       // Delete from Redis
//       await this.redisClient.hdel("plans", id);

//       // Queue delete operation
//       await this.mqService.publishMessage(this.mqService.queues.DELETE, {
//         operation: 'DELETE',
//         planId: id,
//         timestamp: new Date().toISOString()
//       });

//       return { status: 204 };
//     } catch (error) {
//       // Rollback Redis on error
//       if (stored) {
//         await this.redisClient.hset("plans", id, stored);
//       }
//       throw error;
//     }
//   }

//   async searchPlansByService(serviceName) {
//     return this.esService.searchPlansByService(serviceName);
//   }
// }
// // import crypto from 'crypto';

// // export class PlanService {
// //     constructor(redisClient, esService, mqService) {
// //         this.redisClient = redisClient;
// //         this.esService = esService;
// //         this.mqService = mqService;
// //     }

// //     generateEtag(data) {
// //         return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
// //     }

// //     async createPlan(plan) {
// //         if (!plan.objectId) {
// //             throw new Error('Plan must have an objectId');
// //         }

// //         const existingPlan = await this.redisClient.hget("plans", plan.objectId);
// //         if (existingPlan) {
// //             const error = new Error('Plan with this objectId already exists');
// //             error.statusCode = 409;
// //             throw error;
// //         }

// //         const etag = this.generateEtag(plan);
// //         const timestamp = new Date().toISOString();

// //         try {
// //             // Store in Redis
// //             await this.redisClient.hset("plans", plan.objectId, JSON.stringify({
// //                 data: plan,
// //                 etag,
// //                 lastModified: timestamp
// //             }));

// //             // Queue for processing
// //             await this.mqService.publishMessage(this.mqService.queues.CREATE, {
// //                 operation: 'CREATE',
// //                 plan,
// //                 timestamp
// //             });

// //             return { plan, etag, lastModified: timestamp };
// //         } catch (error) {
// //             // Rollback Redis if queueing fails
// //             await this.redisClient.hdel("plans", plan.objectId);
// //             throw error;
// //         }
// //     }

// //     async getPlan(id, headers = {}) {
// //         try {
// //             const { 'if-none-match': ifNoneMatch, 'if-match': ifMatch } = headers;
// //             console.log('Getting plan:', { id, ifNoneMatch, ifMatch });

// //             const stored = await this.redisClient.hget("plans", id);
// //             if (!stored) {
// //                 return { status: 404 };
// //             }

// //             const { data: plan, etag: currentEtag, lastModified } = JSON.parse(stored);

// //             // Handle If-None-Match (return 304 if matches)
// //             if (ifNoneMatch && ifNoneMatch === currentEtag) {
// //                 return { 
// //                     status: 304, 
// //                     etag: currentEtag,
// //                     lastModified 
// //                 };
// //             }

// //             // Handle If-Match (return 412 if doesn't match)
// //             if (ifMatch && ifMatch !== currentEtag) {
// //                 return { status: 412 };
// //             }

// //             return { 
// //                 status: 200, 
// //                 plan, 
// //                 etag: currentEtag,
// //                 lastModified 
// //             };
// //         } catch (error) {
// //             console.error('Error in getPlan:', error);
// //             throw error;
// //         }
// //     }

// //     async updatePlan(id, updates, headers = {}) {
// //         const { 'if-match': ifMatch } = headers;
        
// //         const stored = await this.redisClient.hget("plans", id);
// //         if (!stored) return { status: 404 };

// //         const { data: currentPlan, etag: currentEtag } = JSON.parse(stored);

// //         if (ifMatch && ifMatch !== currentEtag) {
// //             return { status: 412 };
// //         }

// //         const updatedPlan = { ...currentPlan, ...updates };
// //         const newEtag = this.generateEtag(updatedPlan);
// //         const timestamp = new Date().toISOString();

// //         try {
// //             await this.redisClient.hset("plans", id, JSON.stringify({
// //                 data: updatedPlan,
// //                 etag: newEtag,
// //                 lastModified: timestamp
// //             }));

// //             await this.mqService.publishMessage(this.mqService.queues.UPDATE, {
// //                 operation: 'UPDATE',
// //                 plan: updatedPlan,
// //                 timestamp
// //             });

// //             return {
// //                 status: 200,
// //                 plan: updatedPlan,
// //                 etag: newEtag,
// //                 lastModified: timestamp
// //             };
// //         } catch (error) {
// //             // Rollback on error
// //             if (stored) {
// //                 await this.redisClient.hset("plans", id, stored);
// //             }
// //             throw error;
// //         }
// //     }

// //     async deletePlan(id, headers = {}) {
// //         const { 'if-match': ifMatch } = headers;
        
// //         const stored = await this.redisClient.hget("plans", id);
// //         if (!stored) return { status: 404 };

// //         const { etag: currentEtag } = JSON.parse(stored);

// //         if (ifMatch && ifMatch !== currentEtag) {
// //             return { status: 412 };
// //         }

// //         try {
// //             // Delete from Redis
// //             await this.redisClient.hdel("plans", id);
            
// //             // Queue delete operation
// //             await this.mqService.publishMessage(this.mqService.queues.DELETE, {
// //                 operation: 'DELETE',
// //                 planId: id,
// //                 timestamp: new Date().toISOString()
// //             });

// //             return { status: 204 };
// //         } catch (error) {
// //             // Rollback Redis on error
// //             if (stored) {
// //                 await this.redisClient.hset("plans", id, stored);
// //             }
// //             throw error;
// //         }
// //     }

// //     async searchPlansByService(serviceName) {
// //         return this.esService.searchPlansByService(serviceName);
// //     }
// // }

// // export class PlanController {
// //     static async createPlan(req, res) {
// //         try {
// //             const planService = req.services?.planService;
// //             if (!planService) {
// //                 throw new Error('Plan service not properly initialized');
// //             }

// //             const result = await planService.createPlan(req.body);

// //             res.set({
// //                 'ETag': result.etag,
// //                 'Last-Modified': result.lastModified
// //             });
// //             res.status(201).json(result.plan);
// //         } catch (error) {
// //             console.error('Error in createPlan:', error);
// //             res.status(error.statusCode || 500).json({
// //                 error: error.name || 'Internal Server Error',
// //                 message: error.message || 'An error occurred'
// //             });
// //         }
// //     }

// //     static async getPlan(req, res) {
// //         try {
// //             const planService = req.services?.planService;
// //             if (!planService) {
// //                 throw new Error('Plan service not properly initialized');
// //             }

// //             const result = await planService.getPlan(req.params.id, req.headers);

// //             if (result.status === 404) {
// //                 return res.status(404).json({
// //                     error: 'Not Found',
// //                     message: `Plan with ID ${req.params.id} not found`
// //                 });
// //             }

// //             if (result.etag) {
// //                 res.set('ETag', result.etag);
// //             }
// //             if (result.lastModified) {
// //                 res.set('Last-Modified', result.lastModified);
// //             }

// //             if (result.status === 304) {
// //                 return res.status(304).send();
// //             }

// //             if (result.status === 412) {
// //                 return res.status(412).json({
// //                     error: 'Precondition Failed',
// //                     message: 'Plan has been modified'
// //                 });
// //             }

// //             res.json(result.plan);
// //         } catch (error) {
// //             console.error('Error in getPlan:', error);
// //             res.status(500).json({
// //                 error: 'Internal Server Error',
// //                 message: error.message || 'An error occurred'
// //             });
// //         }
// //     }

// //     static async updatePlan(req, res) {
// //         try {
// //             const planService = req.services?.planService;
// //             if (!planService) {
// //                 throw new Error('Plan service not properly initialized');
// //             }

// //             const result = await planService.updatePlan(req.params.id, req.body, req.headers);

// //             if (result.status === 404) {
// //                 return res.status(404).json({
// //                     error: 'Not Found',
// //                     message: `Plan with ID ${req.params.id} not found`
// //                 });
// //             }

// //             if (result.status === 412) {
// //                 return res.status(412).json({
// //                     error: 'Precondition Failed',
// //                     message: 'Plan has been modified'
// //                 });
// //             }

// //             res.set({
// //                 'ETag': result.etag,
// //                 'Last-Modified': result.lastModified
// //             });
// //             res.json(result.plan);
// //         } catch (error) {
// //             console.error('Error in updatePlan:', error);
// //             res.status(500).json({
// //                 error: 'Internal Server Error',
// //                 message: error.message || 'An error occurred'
// //             });
// //         }
// //     }

// //     static async deletePlan(req, res) {
// //         try {
// //             const planService = req.services?.planService;
// //             if (!planService) {
// //                 throw new Error('Plan service not properly initialized');
// //             }

// //             const result = await planService.deletePlan(req.params.id, req.headers);

// //             if (result.status === 404) {
// //                 return res.status(404).json({
// //                     error: 'Not Found',
// //                     message: `Plan with ID ${req.params.id} not found`
// //                 });
// //             }

// //             if (result.status === 412) {
// //                 return res.status(412).json({
// //                     error: 'Precondition Failed',
// //                     message: 'Plan has been modified'
// //                 });
// //             }

// //             res.status(204).send();
// //         } catch (error) {
// //             console.error('Error in deletePlan:', error);
// //             res.status(500).json({
// //                 error: 'Internal Server Error',
// //                 message: error.message || 'An error occurred'
// //             });
// //         }
// //     }

// //     static async searchPlansByService(req, res) {
// //         try {
// //             const planService = req.services?.planService;
// //             if (!planService) {
// //                 throw new Error('Plan service not properly initialized');
// //             }

// //             const serviceName = req.params.serviceName;
// //             const results = await planService.searchPlansByService(serviceName);

// //             res.json(results);
// //         } catch (error) {
// //             console.error('Error in searchPlansByService:', error);
// //             res.status(500).json({
// //                 error: 'Internal Server Error',
// //                 message: error.message || 'An error occurred'
// //             });
// //         }
// //     }
// // }

// // import crypto from 'crypto';

// // export class PlanService {
// //     constructor(redisClient, esService, mqService) {
// //         this.redisClient = redisClient;
// //         this.esService = esService;
// //         this.mqService = mqService;
// //     }

// //     generateEtag(data) {
// //         return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
// //     }

// //     async createPlan(plan) {
// //         if (!plan.objectId) {
// //             throw new Error('Plan must have an objectId');
// //         }

// //         const existingPlan = await this.redisClient.hget('plans', plan.objectId);
// //         if (existingPlan) {
// //             const error = new Error('Plan with this objectId already exists');
// //             error.statusCode = 409;
// //             throw error;
// //         }

// //         const etag = this.generateEtag(plan);
// //         const timestamp = new Date().toISOString();

// //         try {
// //             await this.redisClient.hset('plans', plan.objectId, JSON.stringify({
// //                 data: plan,
// //                 etag,
// //                 lastModified: timestamp
// //             }));

// //             await this.mqService.publishMessage(this.mqService.queues.CREATE, {
// //                 operation: 'CREATE',
// //                 plan,
// //                 timestamp
// //             });

// //             return { plan, etag, lastModified: timestamp };
// //         } catch (error) {
// //             await this.redisClient.hdel('plans', plan.objectId); // Rollback Redis if queueing fails
// //             throw error;
// //         }
// //     }

// //     async getPlan(id, headers = {}) {
// //         const { 'if-none-match': ifNoneMatch, 'if-match': ifMatch } = headers;

// //         const stored = await this.redisClient.hget('plans', id);
// //         if (!stored) {
// //             return { status: 404 };
// //         }

// //         const { data: plan, etag: currentEtag, lastModified } = JSON.parse(stored);

// //         if (ifNoneMatch && ifNoneMatch === currentEtag) {
// //             return { status: 304, etag: currentEtag, lastModified };
// //         }

// //         if (ifMatch && ifMatch !== currentEtag) {
// //             return { status: 412 };
// //         }

// //         return { status: 200, plan, etag: currentEtag, lastModified };
// //     }

// //     async updatePlan(id, updates, headers = {}) {
// //         const { 'if-match': ifMatch } = headers;

// //         const stored = await this.redisClient.hget('plans', id);
// //         if (!stored) return { status: 404 };

// //         const { data: currentPlan, etag: currentEtag } = JSON.parse(stored);

// //         if (ifMatch && ifMatch !== currentEtag) {
// //             return { status: 412 };
// //         }

// //         const updatedPlan = { ...currentPlan, ...updates };
// //         const newEtag = this.generateEtag(updatedPlan);
// //         const timestamp = new Date().toISOString();

// //         try {
// //             await this.redisClient.hset('plans', id, JSON.stringify({
// //                 data: updatedPlan,
// //                 etag: newEtag,
// //                 lastModified: timestamp
// //             }));

// //             await this.mqService.publishMessage(this.mqService.queues.UPDATE, {
// //                 operation: 'UPDATE',
// //                 plan: updatedPlan,
// //                 timestamp
// //             });

// //             return { status: 200, plan: updatedPlan, etag: newEtag, lastModified: timestamp };
// //         } catch (error) {
// //             if (stored) {
// //                 await this.redisClient.hset('plans', id, stored); // Rollback Redis on error
// //             }
// //             throw error;
// //         }
// //     }

// //     async deletePlan(id, headers = {}) {
// //         const { 'if-match': ifMatch } = headers;

// //         const stored = await this.redisClient.hget('plans', id);
// //         if (!stored) return { status: 404 };

// //         const { etag: currentEtag } = JSON.parse(stored);

// //         if (ifMatch && ifMatch !== currentEtag) {
// //             return { status: 412 };
// //         }

// //         try {
// //             await this.redisClient.hdel('plans', id);

// //             await this.mqService.publishMessage(this.mqService.queues.DELETE, {
// //                 operation: 'DELETE',
// //                 planId: id,
// //                 timestamp: new Date().toISOString()
// //             });

// //             return { status: 204 };
// //         } catch (error) {
// //             if (stored) {
// //                 await this.redisClient.hset('plans', id, stored); // Rollback Redis on error
// //             }
// //             throw error;
// //         }
// //     }

// //     async searchPlansByService(serviceName) {
// //         return this.esService.searchPlansByService(serviceName);
// //     }
// // }
// // import crypto from 'crypto';

// // export class PlanService {
// //     constructor(redisClient, esService, mqService) {
// //         this.redisClient = redisClient;
// //         this.esService = esService;
// //         this.mqService = mqService;
// //     }

// //     generateEtag(data) {
// //         return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
// //     }

// //     async createPlan(plan) {
// //         if (!plan.objectId) {
// //             throw new Error('Plan must have an objectId');
// //         }

// //         const existingPlan = await this.redisClient.hget('plans', plan.objectId);
// //         if (existingPlan) {
// //             const error = new Error('Plan with this objectId already exists');
// //             error.statusCode = 409;
// //             throw error;
// //         }

// //         const etag = this.generateEtag(plan);
// //         const timestamp = new Date().toISOString();

// //         try {
// //             // Store in Redis
// //             await this.redisClient.hset('plans', plan.objectId, JSON.stringify({
// //                 data: plan,
// //                 etag,
// //                 lastModified: timestamp
// //             }));

// //             // Index in Elasticsearch
// //             await this.esService.indexPlan(plan);

// //             // Queue for processing (optional for further workflows)
// //             await this.mqService.publishMessage(this.mqService.queues.CREATE, {
// //                 operation: 'CREATE',
// //                 plan,
// //                 timestamp
// //             });

// //             return { plan, etag, lastModified: timestamp };
// //         } catch (error) {
// //             await this.redisClient.hdel('plans', plan.objectId); // Rollback Redis if something fails
// //             throw error;
// //         }
// //     }
// //     async getPlan(id, headers = {}) {
// //         try {
// //             const { 'if-none-match': ifNoneMatch, 'if-match': ifMatch } = headers;
// //             console.log(`Fetching plan with ID: ${id}`);
    
// //             // Fetch plan from Redis
// //             const stored = await this.redisClient.hget('plans', id);
// //             console.log(`Fetched plan from Redis:`, stored);
    
// //             if (!stored) {
// //                 console.warn(`Plan with ID ${id} not found in Redis`);
// //                 return { status: 404 };
// //             }
    
// //             const { data: plan, etag: currentEtag, lastModified } = JSON.parse(stored);
    
// //             if (ifNoneMatch && ifNoneMatch === currentEtag) {
// //                 return { status: 304, etag: currentEtag, lastModified };
// //             }
    
// //             if (ifMatch && ifMatch !== currentEtag) {
// //                 return { status: 412 };
// //             }
    
// //             return { status: 200, plan, etag: currentEtag, lastModified };
// //         } catch (error) {
// //             console.error('Error in getPlan:', error);
// //             throw error;
// //         }
// //     }
    
// //     async getPlan(id, headers = {}) {
// //         const { 'if-none-match': ifNoneMatch, 'if-match': ifMatch } = headers;

// //         // Fetch from Redis
// //         const stored = await this.redisClient.hget('plans', id);
// //         if (!stored) {
// //             return { status: 404 };
// //         }

// //         const { data: plan, etag: currentEtag, lastModified } = JSON.parse(stored);

// //         if (ifNoneMatch && ifNoneMatch === currentEtag) {
// //             return { status: 304, etag: currentEtag, lastModified };
// //         }

// //         if (ifMatch && ifMatch !== currentEtag) {
// //             return { status: 412 };
// //         }

// //         return { status: 200, plan, etag: currentEtag, lastModified };
// //     }

// //     async updatePlan(id, updates, headers = {}) {
// //         const { 'if-match': ifMatch } = headers;

// //         const stored = await this.redisClient.hget('plans', id);
// //         if (!stored) return { status: 404 };

// //         const { data: currentPlan, etag: currentEtag } = JSON.parse(stored);

// //         if (ifMatch && ifMatch !== currentEtag) {
// //             return { status: 412 };
// //         }

// //         const updatedPlan = { ...currentPlan, ...updates };
// //         const newEtag = this.generateEtag(updatedPlan);
// //         const timestamp = new Date().toISOString();

// //         try {
// //             // Update in Redis
// //             await this.redisClient.hset('plans', id, JSON.stringify({
// //                 data: updatedPlan,
// //                 etag: newEtag,
// //                 lastModified: timestamp
// //             }));

// //             // Update in Elasticsearch
// //             await this.esService.indexPlan(updatedPlan);

// //             // Queue update operation (optional for workflows)
// //             await this.mqService.publishMessage(this.mqService.queues.UPDATE, {
// //                 operation: 'UPDATE',
// //                 plan: updatedPlan,
// //                 timestamp
// //             });

// //             return { status: 200, plan: updatedPlan, etag: newEtag, lastModified: timestamp };
// //         } catch (error) {
// //             if (stored) {
// //                 await this.redisClient.hset('plans', id, stored); // Rollback Redis on error
// //             }
// //             throw error;
// //         }
// //     }

// //     async deletePlan(id, headers = {}) {
// //         const { 'if-match': ifMatch } = headers;

// //         const stored = await this.redisClient.hget('plans', id);
// //         if (!stored) return { status: 404 };

// //         const { etag: currentEtag } = JSON.parse(stored);

// //         if (ifMatch && ifMatch !== currentEtag) {
// //             return { status: 412 };
// //         }

// //         try {
// //             // Delete from Redis
// //             await this.redisClient.hdel('plans', id);

// //             // Delete from Elasticsearch
// //             await this.esService.deletePlan(id);

// //             // Queue delete operation
// //             await this.mqService.publishMessage(this.mqService.queues.DELETE, {
// //                 operation: 'DELETE',
// //                 planId: id,
// //                 timestamp: new Date().toISOString()
// //             });

// //             return { status: 204 };
// //         } catch (error) {
// //             if (stored) {
// //                 await this.redisClient.hset('plans', id, stored); // Rollback Redis on error
// //             }
// //             throw error;
// //         }
// //     }

// //     async searchPlansByService(serviceName) {
// //         return this.esService.searchPlansByService(serviceName);
// //     }
// // }



// import crypto from 'crypto';

// export class PlanService {
//     constructor(redisClient, esService, mqService) {
//         this.redisClient = redisClient;
//         this.esService = esService;
//         this.mqService = mqService;
//     }

//     generateEtag(data) {
//         return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
//     }

//     async createPlan(plan) {
//         if (!plan.objectId) {
//             throw new Error('Plan must have an objectId');
//         }

//         const existingPlan = await this.redisClient.hget('plans', plan.objectId);
//         if (existingPlan) {
//             const error = new Error('Plan with this objectId already exists');
//             error.statusCode = 409;
//             throw error;
//         }

//         const etag = this.generateEtag(plan);
//         const timestamp = new Date().toISOString();

//         try {
//             // Store in Redis
//             await this.redisClient.hset('plans', plan.objectId, JSON.stringify({
//                 data: plan,
//                 etag,
//                 lastModified: timestamp
//             }));

//             // Index in Elasticsearch
//             await this.esService.indexPlan(plan);

//             // Queue for processing (optional for further workflows)
//             await this.mqService.publishMessage(this.mqService.queues.CREATE, {
//                 operation: 'CREATE',
//                 plan,
//                 timestamp
//             });

//             return { plan, etag, lastModified: timestamp };
//         } catch (error) {
//             await this.redisClient.hdel('plans', plan.objectId); // Rollback Redis if something fails
//             throw error;
//         }
//     }
    
    
//     async getPlan(id, headers = {}) {
//         const { 'if-none-match': ifNoneMatch, 'if-match': ifMatch } = headers;

//         // Fetch from Redis
//         const stored = await this.redisClient.hget('plans', id);
//         if (!stored) {
//             return { status: 404 };
//         }

//         const { data: plan, etag: currentEtag, lastModified } = JSON.parse(stored);

//         if (ifNoneMatch && ifNoneMatch === currentEtag) {
//             return { status: 304, etag: currentEtag, lastModified };
//         }

//         if (ifMatch && ifMatch !== currentEtag) {
//             return { status: 412 };
//         }

//         return { status: 200, plan, etag: currentEtag, lastModified };
//     }

//     async updatePlan(id, updates, headers = {}) {
//         const { 'if-match': ifMatch } = headers;

//         const stored = await this.redisClient.hget('plans', id);
//         if (!stored) return { status: 404 };

//         const { data: currentPlan, etag: currentEtag } = JSON.parse(stored);

//         if (ifMatch && ifMatch !== currentEtag) {
//             return { status: 412 };
//         }

//         const updatedPlan = { ...currentPlan, ...updates };
//         const newEtag = this.generateEtag(updatedPlan);
//         const timestamp = new Date().toISOString();

//         try {
//             // Update in Redis
//             await this.redisClient.hset('plans', id, JSON.stringify({
//                 data: updatedPlan,
//                 etag: newEtag,
//                 lastModified: timestamp
//             }));

//             // Update in Elasticsearch
//             await this.esService.indexPlan(updatedPlan);

//             // Queue update operation (optional for workflows)
//             await this.mqService.publishMessage(this.mqService.queues.UPDATE, {
//                 operation: 'UPDATE',
//                 plan: updatedPlan,
//                 timestamp
//             });

//             return { status: 200, plan: updatedPlan, etag: newEtag, lastModified: timestamp };
//         } catch (error) {
//             if (stored) {
//                 await this.redisClient.hset('plans', id, stored); // Rollback Redis on error
//             }
//             throw error;
//         }
//     }
//     async patchPlan(id, updates, headers = {}) {
//       const { 'if-match': ifMatch, 'if-none-match': ifNoneMatch } = headers;
  
//       const stored = await this.redisClient.hget('plans', id);
//       if (!stored) return { status: 404 };
  
//       const { data: currentPlan, etag: currentEtag } = JSON.parse(stored);
  
//       if (ifMatch && ifMatch !== currentEtag) {
//           return { status: 412, message: 'Plan has been modified since last retrieval' };
//       }
  
//       if (ifNoneMatch && ifNoneMatch === currentEtag) {
//           return { status: 412, message: 'Plan matches the specified version' };
//       }
  
//       const patchedPlan = this.deepMergeWithAppend(currentPlan, updates);
//       const timestamp = new Date().toISOString();
//       const newEtag = this.generateEtag(patchedPlan);
  
//       await this.redisClient.hset('plans', id, JSON.stringify({
//           data: patchedPlan,
//           etag: newEtag,
//           lastModified: timestamp
//       }));
  
//       try {
//           await this.esService.indexPlan(patchedPlan);
//           return { status: 200, plan: patchedPlan, etag: newEtag, lastModified: timestamp };
//       } catch (error) {
//           throw error;
//       }
//   }
  
//   deepMergeWithAppend(target, source) {
//       for (const key of Object.keys(source)) {
//           if (Array.isArray(source[key]) && Array.isArray(target[key])) {
//               // Append unique items from source array to the target array
//               const existingIds = new Set(target[key].map(item => item.objectId));
//               for (const newItem of source[key]) {
//                   if (!existingIds.has(newItem.objectId)) {
//                       target[key].push(newItem);
//                   }
//               }
//           } else if (source[key] instanceof Object && key in target) {
//               Object.assign(source[key], this.deepMergeWithAppend(target[key], source[key]));
//           } else {
//               target[key] = source[key];
//           }
//       }
//       return target;
//   }
  
    

//     async deletePlan(id, headers = {}) {
//       const { 'if-match': ifMatch } = headers;

//       const stored = await this.redisClient.hget('plans', id);
//       if (!stored) return { status: 404 };

//       const { etag: currentEtag } = JSON.parse(stored);

//       if (ifMatch && ifMatch !== currentEtag) {
//           return { status: 412 };
//       }

//       try {
//           // Delete from Redis
//           await this.redisClient.hdel('plans', id);

//           // Delete from Elasticsearch
//           await this.esService.deletePlan(id);

//           // Queue delete operation
//           await this.mqService.publishMessage(this.mqService.queues.DELETE, {
//               operation: 'DELETE',
//               planId: id,
//               timestamp: new Date().toISOString()
//           });

//           return { status: 204 };
//       } catch (error) {
//           if (stored) {
//               await this.redisClient.hset('plans', id, stored); // Rollback Redis on error
//           }
//           throw error;
//       }
//   }

//     async searchPlansByService(serviceName) {
//       try {
//           const result = await this.esClient.search({
//               index: this.indexName,
//               body: {
//                   query: {
//                       match: {
//                           'linkedPlanServices.linkedService.name': serviceName,
//                       },
//                   },
//               },
//           });
//           return result.body.hits.hits;
//       } catch (error) {
//           console.error('Error searching plans by service:', error);
//           throw error;
//       }
//   }
// }

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
        const { 'if-none-match': ifNoneMatch, 'if-match': ifMatch } = headers;

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

            // Queue update operation
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

    async patchPlan(id, updates, headers = {}) {
        const { 'if-match': ifMatch, 'if-none-match': ifNoneMatch } = headers;

        const stored = await this.redisClient.hget('plans', id);
        if (!stored) return { status: 404 };

        const { data: currentPlan, etag: currentEtag } = JSON.parse(stored);

        if (ifMatch && ifMatch !== currentEtag) {
            return { status: 412, message: 'Plan has been modified since last retrieval' };
        }

        if (ifNoneMatch && ifNoneMatch === currentEtag) {
            return { status: 412, message: 'Plan matches the specified version' };
        }

        const patchedPlan = this.deepMergeWithAppend(currentPlan, updates);
        const timestamp = new Date().toISOString();
        const newEtag = this.generateEtag(patchedPlan);

        await this.redisClient.hset('plans', id, JSON.stringify({
            data: patchedPlan,
            etag: newEtag,
            lastModified: timestamp
        }));

        try {
            await this.esService.indexPlan(patchedPlan);
            return { status: 200, plan: patchedPlan, etag: newEtag, lastModified: timestamp };
        } catch (error) {
            throw error;
        }
    }

    deepMergeWithAppend(target, source) {
        for (const key of Object.keys(source)) {
            if (Array.isArray(source[key]) && Array.isArray(target[key])) {
                const existingIds = new Set(target[key].map(item => item.objectId));
                for (const newItem of source[key]) {
                    if (!existingIds.has(newItem.objectId)) {
                        target[key].push(newItem);
                    }
                }
            } else if (source[key] instanceof Object && key in target) {
                Object.assign(source[key], this.deepMergeWithAppend(target[key], source[key]));
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }

    // async deletePlan(id, headers = {}) {
    //     const { 'if-match': ifMatch } = headers;

    //     const stored = await this.redisClient.hget('plans', id);
    //     if (!stored) return { status: 404 };

    //     const { etag: currentEtag } = JSON.parse(stored);

    //     if (ifMatch && ifMatch !== currentEtag) {
    //         return { status: 412 };
    //     }

    //     try {
    //         // Delete from Redis
    //         await this.redisClient.hdel('plans', id);

    //         // Delete the entire index and associated objects from Elasticsearch
    //         await this.esService.deleteCompletePlan(id);

    //         // Queue delete operation
    //         await this.mqService.publishMessage(this.mqService.queues.DELETE, {
    //             operation: 'DELETE',
    //             planId: id,
    //             timestamp: new Date().toISOString()
    //         });

    //         return { status: 204 };
    //     } catch (error) {
    //         if (stored) {
    //             await this.redisClient.hset('plans', id, stored); // Rollback Redis on error
    //         }
    //         throw error;
    //     }
    // }
    // async deletePlan(id, headers = {}) {
    //     const { 'if-match': ifMatch } = headers;

    //     // Fetch the plan from Redis
    //     const stored = await this.redisClient.hget('plans', id);
    //     if (!stored) {
    //         return { status: 404, message: `Plan with ID ${id} not found.` };
    //     }

    //     const { etag: currentEtag } = JSON.parse(stored);

    //     // Check if-match condition
    //     if (ifMatch && ifMatch !== currentEtag) {
    //         return { status: 412, message: 'Precondition failed: ETag does not match.' };
    //     }

    //     try {
    //         // Delete from Redis
    //         await this.redisClient.hdel('plans', id);

    //         // Delete from Elasticsearch
    //         await this.esService.deleteCompletePlan(id);

    //         // Queue the delete operation
    //         await this.mqService.publishMessage(this.mqService.queues.DELETE, {
    //             operation: 'DELETE',
    //             planId: id,
    //             timestamp: new Date().toISOString()
    //         });

    //         console.log(`Plan with ID ${id} deleted from Redis and Elasticsearch.`);
    //         return { status: 204 }; // No content
    //     } catch (error) {
    //         console.error(`Error deleting plan with ID ${id}:`, error);
    //         throw error;
    //     }
    // }
    // async deletePlan(id, headers = {}) {
    //     const { 'if-match': ifMatch } = headers;

    //     // Fetch the plan from Redis
    //     const stored = await this.redisClient.hget('plans', id);
    //     if (!stored) {
    //         return { status: 404, message: `Plan with ID ${id} not found.` };
    //     }

    //     const { etag: currentEtag } = JSON.parse(stored);

    //     // Check if-match condition
    //     if (ifMatch && ifMatch !== currentEtag) {
    //         return { status: 412, message: 'Precondition failed: ETag does not match.' };
    //     }

    //     try {
    //         // Delete from Redis
    //         await this.redisClient.hdel('plans', id);

    //         // Delete from Elasticsearch
    //         await this.esService.deleteCompletePlan(id);

    //         // Queue the delete operation
    //         await this.mqService.publishMessage(this.mqService.queues.DELETE, {
    //             operation: 'DELETE',
    //             planId: id,
    //             timestamp: new Date().toISOString()
    //         });

    //         console.log(`Plan with ID ${id} deleted from Redis and Elasticsearch.`);
    //         return { status: 204 }; // No content
    //     } catch (error) {
    //         console.error(`Error deleting plan with ID ${id}:`, error);
    //         throw error;
    //     }
    // }
    
    
    // async deletePlan(id, headers = {}) {
    //     const { 'if-match': ifMatch } = headers;

    //     // Fetch the plan from Redis
    //     const stored = await this.redisClient.hget('plans', id);
    //     if (!stored) {
    //         return { status: 404, message: `Plan with ID ${id} not found.` };
    //     }

    //     const { etag: currentEtag } = JSON.parse(stored);

    //     // Check if-match condition
    //     if (ifMatch && ifMatch !== currentEtag) {
    //         return { status: 412, message: 'Precondition failed: ETag does not match.' };
    //     }

    //     try {
    //         // Delete from Redis
    //         await this.redisClient.hdel('plans', id);

    //         // Recursively delete from Elasticsearch, including index
    //         await this.esService.deleteCompletePlanAndIndex(id);

    //         // Queue the delete operation for further processing
    //         await this.mqService.publishMessage(this.mqService.queues.DELETE, {
    //             operation: 'DELETE',
    //             planId: id,
    //             timestamp: new Date().toISOString(),
    //         });

    //         console.log(`Plan with ID ${id} and all its associated data deleted.`);
    //         return { status: 204 }; // No content
    //     } catch (error) {
    //         console.error(`Error deleting plan with ID ${id}: ${error.message}`);
    //         return { status: 500, message: 'Internal Server Error' };
    //     }
    // }

    async deletePlan(id, headers = {}) {
        const { 'if-match': ifMatch } = headers;
    
        // Fetch the plan from Redis
        const stored = await this.redisClient.hget('plans', id);
        if (!stored) {
            return { status: 404, message: `Plan with ID ${id} not found.` };
        }
    
        const { etag: currentEtag } = JSON.parse(stored);
    
        // Check if-match condition
        if (ifMatch && ifMatch !== currentEtag) {
            return { status: 412, message: 'Precondition failed: ETag does not match.' };
        }
    
        try {
            // Delete the plan from Redis
            await this.redisClient.hdel('plans', id);
    
            // Delete the plan and its associated data from Elasticsearch
            await this.esService.deleteCompletePlanAndIndex(id);
    
            // Notify via message queue
            await this.mqService.publishMessage(this.mqService.queues.DELETE, {
                operation: 'DELETE',
                planId: id,
                timestamp: new Date().toISOString(),
            });
    
            console.log(`Plan with ID ${id} and its associated data successfully deleted.`);
            return { status: 204 }; // No content
        } catch (error) {
            console.error(`Error deleting plan with ID ${id}: ${error.message}`);
            return { status: 500, message: 'Internal Server Error' };
        }
    }
    
    async searchPlansByService(serviceName) {
        try {
            const result = await this.esService.searchPlansByService(serviceName);
            return result;
        } catch (error) {
            console.error('Error searching plans by service:', error);
            throw error;
        }
    }
}
