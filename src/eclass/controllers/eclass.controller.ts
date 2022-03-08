// we import express to add types to the request/response objects from our controller functions
import express from 'express';
import debug from 'debug';
// http response enum
import {StatusCodes} from 'http-status-codes';
import {LoadDatabaseService} from "../services/load-database.service";
import responseService from "../../common/services/response.service";
import {TableFieldsService} from "../services/table-fields.service";

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
    
    /**
     * This endpoint is for getting fields of main tables, namely: Class, Property, Value, Unit
     * @param req
     * @param res
     */
    async getFields(req: express.Request, res: express.Response) {
        let result: any;
        log(result = (new TableFieldsService()).getFieldsOfAllTables());
        result.then((resp: any) => {
            res.status(StatusCodes.OK).send(resp);
        }).catch((error: any) => {
            const result = responseService.err(error.message);
            res.status(StatusCodes.BAD_REQUEST).send(result);
        });
    }
}

export default new EclassController();