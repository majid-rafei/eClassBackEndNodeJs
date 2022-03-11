import {FinalResponseInterface} from "../../common/interfaces/response.interface";
import responseService from "../../common/services/response.service";
import {EclassClDao} from "../daos/eclass-cl.dao";
import {EclassPrDao} from "../daos/eclass-pr.dao";
import {EclassVaDao} from "../daos/eclass-va.dao";
import {EclassUnDao} from "../daos/eclass-un.dao";

export class TableFieldsService {
    
    async getFieldsOfAllTables(): Promise<FinalResponseInterface> {
        let clFields = await (new EclassClDao()).getMany({}, 1).catch((error: any) => {
            throw new Error(error.message);
        });
        let prFields = await (new EclassPrDao()).getMany({}, 1).catch((error: any) => {
            throw new Error(error.message);
        });
        let vaFields = await (new EclassVaDao()).getMany({}, 1).catch((error: any) => {
            throw new Error(error.message);
        });
        let unFields = await (new EclassUnDao()).getMany({}, 1).catch((error: any) => {
            throw new Error(error.message);
        });
        return responseService.rsp({
            item: {
                cl: Object.keys(clFields[0]).map(val => {return {col: val, type: 's'}}),
                pr: Object.keys(prFields[0]).map(val => {return {col: val, type: 's'}}),
                va: Object.keys(vaFields[0]).map(val => {return {col: val, type: 's'}}),
                un: Object.keys(unFields[0]).map(val => {return {col: val, type: 's'}}),
            }
        })
    }
}