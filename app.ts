import express from "express";
import * as http from "http";
import * as winston from "winston";
import * as expressWinston from 'express-winston';
import cors from 'cors';
import {CommonRoutesConfig} from "./src/common/common.routes.config";
import {debug} from "debug";
import {EclassRoutesConfig} from "./src/eclass/eclass.routes.config";

/**
 * Here we are defining constants.
 */
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

/**
 * Here we are adding middleware to the Application
 */
// To parse all incoming requests as JSON
app.use(express.json());

// To allow cross-origin requests
app.use(cors());

// To prepare the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true})
    ),
};
if (! process.env.DEBUG) {
    // When not debugging, log requests as one-liners
    loggerOptions.meta = false;
}
// Initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

/**
 * Here we are adding the Routes of each module to the routes array of the app,
 * after sending the Express.js application object to have the routes added to our app!
 */
routes.push(new EclassRoutesConfig(app));

/**
 * This is a simple route to make sure everything is working properly
 */
const runningMessage = `Server running at http://localhost:${port}`;
app.get('/',
    (req: express.Request, res: express.Response) => {
        res.status(200).send(runningMessage);
    }
);

/**
 * Final step: starting the server and listening to the port
 */
server.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
        debug(`Routes configured for ${route.getName()}`);
    });
    // Our only exception to avoiding console.log(), because we
    // always want to know when the server is done starting up
    console.log(runningMessage);
});