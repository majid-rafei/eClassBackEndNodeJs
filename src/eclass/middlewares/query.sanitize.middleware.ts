import express from 'express';
let validator = require('validator');

class QuerySanitizeMiddleware {
    
    sanitize = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        for (let key in req.query) {
            req.query[key] = validator.escape(String(req.query[key]))
        }
        next();
    }
}

export default new QuerySanitizeMiddleware();