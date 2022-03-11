import express from 'express';
import userService from '../services/users.service';
import debug from 'debug';
import {StatusCodes} from 'http-status-codes';
import responseService from "../../common/services/response.service";

const log: debug.IDebugger = debug('app:users-middleware');

class UsersMiddleware {
    
    /**
     * Checks if request body contains email and password.
     * @param req
     * @param res
     * @param next
     */
    validateRequiredUserBodyFields = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (req.body && req.body.email && req.body.password) {
            next();
        } else {
            let err = responseService.err(`Missing required fields email and password`);
            res.status(StatusCodes.BAD_REQUEST).send(err);
        }
    }
    
    /**
     * Checks if email is not used by someone else.
     * @param req
     * @param res
     * @param next
     */
    validateSameEmailDoesntExist = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const user = await userService.getByEmail(req.body.email);
        if (user && user.id > 0) {
            let err = responseService.err(`User email already exists`);
            res.status(StatusCodes.BAD_REQUEST).send(err);
        } else {
            next();
        }
    }
    
    /**
     * Checks if the id and email match.
     * @param req
     * @param res
     * @param next
     */
    validateSameEmailBelongToSameUser = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const user = await userService.getByEmail(req.body.email);
        if (user && user.id === Number(req.params.userId)) {
            next();
        } else {
            let err = responseService.err(`Invalid email`);
            res.status(StatusCodes.BAD_REQUEST).send(err);
        }
    }
    
    /**
     * Checks if user exists.
     * @param req
     * @param res
     * @param next
     */
    validateUserExists = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const user = await userService.getById(Number(req.params.userId));
        if (user && user.id > 0) {
            next();
        } else {
            let err = responseService.err(`User ${req.params.userId} not found`);
            res.status(StatusCodes.NOT_FOUND).send(err);
        }
    }
    
    /**
     * Extracts user id from params and adds it to the request body.
     * @param req
     * @param res
     * @param next
     */
    extractUserId = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        req.body.id = Number(req.params.userId);
        next();
    }
}

export default new UsersMiddleware();