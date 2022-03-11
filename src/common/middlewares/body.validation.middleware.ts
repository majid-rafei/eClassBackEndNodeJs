import express from 'express';
import {validationResult} from 'express-validator';
import {StatusCodes} from 'http-status-codes';
import responseService from "../services/response.service";

class BodyValidationMiddleware {
    
    verifyBodyFieldsErrors(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let err = responseService.err('Invalid inputs', errors.array());
            return res.status(StatusCodes.BAD_REQUEST).send(err);
        }
        next();
    }
}

export default new BodyValidationMiddleware();