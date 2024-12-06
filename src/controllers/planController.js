
export class PlanController {
    static async createPlan(req, res) {
        try {
            const planService = req.services?.planService;
            if (!planService) {
                throw new Error('Plan service not properly initialized');
            }

            const result = await planService.createPlan(req.body);

            res.set({
                'ETag': result.etag,
                'Last-Modified': result.lastModified
            });
            res.status(201).json(result.plan);
        } catch (error) {
            console.error('Error in createPlan:', error);
            res.status(error.statusCode || 500).json({
                error: error.name || 'Internal Server Error',
                message: error.message || 'An error occurred'
            });
        }
    }

    static async getPlan(req, res) {
        try {
            const planService = req.services?.planService;
            if (!planService) {
                throw new Error('Plan service not properly initialized');
            }

            const result = await planService.getPlan(req.params.id, req.headers);

            if (result.status === 404) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: `Plan with ID ${req.params.id} not found`
                });
            }

            if (result.etag) {
                res.set('ETag', result.etag);
            }
            if (result.lastModified) {
                res.set('Last-Modified', result.lastModified);
            }

            if (result.status === 304) {
                return res.status(304).send();
            }

            res.json(result.plan);
        } catch (error) {
            console.error('Error in getPlan:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: error.message || 'An error occurred'
            });
        }
    }

    static async updatePlan(req, res) {
        try {
            const planService = req.services?.planService;
            if (!planService) {
                throw new Error('Plan service not properly initialized');
            }

            const result = await planService.updatePlan(req.params.id, req.body, req.headers);

            if (result.status === 404) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: `Plan with ID ${req.params.id} not found`
                });
            }

            res.set({
                'ETag': result.etag,
                'Last-Modified': result.lastModified
            });
            res.json(result.plan);
        } catch (error) {
            console.error('Error in updatePlan:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: error.message || 'An error occurred'
            });
        }
    }

    static async patchPlan(req, res) {
        try {
            const planService = req.services?.planService;
            if (!planService) {
                throw new Error('Plan service not properly initialized');
            }

            const result = await planService.patchPlan(req.params.id, req.body, req.headers);

            if (result.status === 404) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: `Plan with id ${req.params.id} not found`
                });
            }

            if (result.status === 412) {
                return res.status(412).json({
                    error: 'Precondition Failed',
                    message: result.message
                });
            }

            res.set({
                'ETag': result.etag,
                'Last-Modified': result.lastModified
            });
            res.json(result.plan);
        } catch (error) {
            console.error('Error in patchPlan:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: error.message || 'An error occurred'
            });
        }
    }

    static async deletePlan(req, res) {
        try {
            const planService = req.services?.planService;
            if (!planService) {
                throw new Error('Plan service not properly initialized');
            }

            const result = await planService.deletePlan(req.params.id, req.headers);

            if (result.status === 404) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: `Plan with ID ${req.params.id} not found`
                });
            }

            res.status(204).send();
        } catch (error) {
            console.error('Error in deletePlan:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: error.message || 'An error occurred'
            });
        }
    }

    static async searchPlansByService(req, res) {
        try {
            const planService = req.services?.planService;
            if (!planService) {
                throw new Error('Plan service not properly initialized');
            }

            const serviceName = req.params.serviceName;
            const results = await planService.searchPlansByService(serviceName);

            res.json(results);
        } catch (error) {
            console.error('Error in searchPlansByService:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: error.message || 'An error occurred'
            });
        }
    }
}
