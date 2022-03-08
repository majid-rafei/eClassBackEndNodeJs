// we import express to add types to the request/response objects from our controller functions
import express from 'express';
import debug from 'debug';
// http response enum
import {StatusCodes} from 'http-status-codes';
import {LoadDatabaseService} from "../services/load-database.service";
import responseService from "../../common/services/response.service";

const log: debug.IDebugger = debug('app:eclass-controller');

class EclassController {
    
    constructor() { }
    
    async initializeDatabase(req: express.Request, res: express.Response) {
        let result: any;
        log(result = (new LoadDatabaseService()).initializeDatabase());
        result.then((resp: any) => {
            res.status(StatusCodes.OK).send(resp);
        }).catch((error: any) => {
            const result = responseService.err(error.message);
            res.status(StatusCodes.BAD_REQUEST).send(result);
        });
    }
}

export default new EclassController();