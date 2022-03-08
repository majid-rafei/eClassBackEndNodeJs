import {CommonRoutesConfig} from '../common/common.routes.config';
import express from 'express';
import EclassController from "./controllers/eclass.controller";

export class EclassRoutesConfig extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }
    
    configureRoutes(): express.Application {
        this.app
            .route(`/eclass/initializeDatabase`)
            .get(EclassController.initializeDatabase);
        
        return this.app;
    }
}