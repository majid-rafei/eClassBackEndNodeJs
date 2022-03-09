import {CommonRoutesConfig} from '../common/common.routes.config';
import express from 'express';
import EclassController from "./controllers/eclass.controller";
import QuerySanitizeMiddleware from "./middlewares/query.sanitize.middleware";

export class EclassRoutesConfig extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }
    
    configureRoutes(): express.Application {
        /**
         * Route for initializing database using sample CSV files in the `data` directory of the project.
         */
        this.app
            .route(`/eclass/initializeDatabase`)
            .get(EclassController.initializeDatabase);
    
        /**
         * Route for getting fields of all E-class main tables
         */
        this.app
            .route(`/eclass/getFields`)
            .get(EclassController.getFields);
        
        /**
         * Route for getting structured data of simple E-class system
         */
        this.app
            .route(`/eclass/getStructuredData`)
            .get([
                QuerySanitizeMiddleware.sanitize,
                EclassController.getStructuredData,
            ]);
    
        return this.app;
    }
}