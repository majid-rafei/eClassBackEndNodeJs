import {CommonRoutesConfig} from '../common/common.routes.config';
import UsersController from './controllers/users.controller';
import UsersMiddleware from './middlewares/users.middleware';
import express from 'express';
import {body} from 'express-validator';
import BodyValidationMiddleware from "../common/middlewares/body.validation.middleware";

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }
    
    /**
     * Configures routes of the user module.
     */
    configureRoutes(): express.Application {
        /**
         * GET: [getAll], POST: [create].
         */
        this.app
            .route(`/users`)
            .get(UsersController.getAll)
            .post(
                body('email')
                    .isEmail(),
                body('password')
                    .isLength({min: 5})
                    .withMessage('Must include password (5+ characters)'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                UsersMiddleware.validateRequiredUserBodyFields,
                UsersMiddleware.validateSameEmailDoesntExist,
                UsersController.create
            );
        
        /**
         * The following middlewares gets userId from request params and sets it in request body.
         * The following routes need userId in the body of the request.
         */
        this.app.param(`userId`, UsersMiddleware.extractUserId);
        /**
         * GET: [getById], DELETE: [deleteById],
         */
        this.app
            .route(`/users/:userId`)
            .all(UsersMiddleware.validateUserExists)
            .get(UsersController.getById)
            .delete(UsersController.deleteById);
        /**
         * PUT: [updateById]
         */
        this.app.put(`/users/:userId`, [
            UsersMiddleware.validateRequiredUserBodyFields,
            body('email').isEmail(),
            body('password')
                .isLength({min: 5})
                .withMessage('Must include password (5+ characters)'),
            body('firstName').isString(),
            body('lastName').isString(),
            body('permissionLevel').isInt(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            UsersMiddleware.validateSameEmailBelongToSameUser,
            UsersController.updateById,
        ]);
        
        return this.app;
    }
}