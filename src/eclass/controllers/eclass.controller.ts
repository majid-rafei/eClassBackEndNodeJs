// we import express to add types to the request/response objects from our controller functions
import express from 'express';
import debug from 'debug';
// http response enum
import {StatusCodes} from 'http-status-codes';

const log: debug.IDebugger = debug('app:eclass-controller');

class EclassController {
    
    constructor() { }
    
    async initializeDatabase(req: express.Request, res: express.Response) {
        log('At initializeDatabase endpoint')
        res.status(StatusCodes.OK).send('The initializeDatabase endpoint is OK');
    }
}

export default new EclassController();