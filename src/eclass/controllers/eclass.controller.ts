// we import express to add types to the request/response objects from our controller functions
import express from 'express';
import debug from 'debug';
// http response enum
import {StatusCodes} from 'http-status-codes';
import {LoadDatabaseService} from "../services/load-database.service";
import responseService from "../../common/services/response.service";
import {TableFieldsService} from "../services/table-fields.service";
import {SearchEclassService} from "../services/search-eclass.service";
import {EclassFilters} from "../../common/interfaces/filters.interface";

const log: debug.IDebugger = debug('app:eclass-controller');

class EclassController {
    
    constructor() { }
    
    /**
     * This endpoint is for initializing database using sample CSV files.
     * @param req
     * @param res
     */
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
    
    /**
     * This endpoint is for getting structured data from simple E-class system
     * @param req
     * @param res
     */
    async getStructuredData(req: express.Request, res: express.Response) {
        let result: any;
        let filters: EclassFilters = {
            tx: String(req.query.tx),
            cl: {c: String(req.query.clc), q: String(req.query.clq)},
            pr: {c: String(req.query.prc), q: String(req.query.prq)},
            va: {c: String(req.query.vac), q: String(req.query.vaq)},
            un: {c: String(req.query.unc), q: String(req.query.unq)},
        }
        log(result = (new SearchEclassService()).getStructuredData(filters));
        result.then((resp: any) => {
            res.status(StatusCodes.OK).send(resp);
        }).catch((error: any) => {
            const result = responseService.err(error.message);
            res.status(StatusCodes.BAD_REQUEST).send(result);
        });
    }
}

export default new EclassController();