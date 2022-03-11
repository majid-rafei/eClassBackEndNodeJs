import { CommonRoutesConfig } from '../common/common.routes.config';
import authController from './controllers/auth.controller';
import authMiddleware from './middlewares/auth.middleware';
import express from 'express';
import { body } from 'express-validator';
import BodyValidationMiddleware from "../common/middlewares/body.validation.middleware";
import jwtMiddleware from "./middlewares/jwt.middleware";

export class AuthRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'AuthRoutes');
    }
    
    configureRoutes(): express.Application {
        this.app.post(`/auth`, [
            body('email').isEmail(),
            body('password').isString(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            authMiddleware.verifyUserPassword,
            authController.createJwt,
        ]);
    
        this.app.post(`/auth/refreshToken`, [
            jwtMiddleware.validateJwt,
            jwtMiddleware.verifyRefreshBodyField,
            jwtMiddleware.validateRefreshToken,
            authController.createJwt,
        ]);
        
        return this.app;
    }
}