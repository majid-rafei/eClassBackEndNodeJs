import express from 'express';

export abstract class CommonRoutesConfig {
    app: express.Application;
    name: string;
    
    /**
     * Inherited modules should provide dependencies: app and name
     * @param app
     * @param name
     * @protected
     */
    protected constructor(
        app: express.Application,
        name: string,
    ) {
        this.app = app;
        this.name = name;
        this.configureRoutes();
    }
    
    getName() {
        return this.name;
    }
    
    /**
     * Inherited modules should implement this function
     */
    abstract configureRoutes(): express.Application;
}