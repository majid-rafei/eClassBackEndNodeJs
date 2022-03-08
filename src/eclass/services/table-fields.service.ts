import {FinalResponse} from "../../common/interfaces/response.interface";
import responseService from "../../common/services/response.service";
import {EclassClDao} from "../daos/eclass-cl.dao";
import {EclassPrDao} from "../daos/eclass-pr.dao";
import {EclassVaDao} from "../daos/eclass-va.dao";
import {EclassUnDao} from "../daos/eclass-un.dao";

export class TableFieldsService {
    
    async getFieldsOfAllTables(): Promise<FinalResponse> {
        let ccFields = await (new EclassClDao()).getMany({}, 1).catch((error: any) => {
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
            items: {
                cl: Object.keys(ccFields[0]),
                pr: Object.keys(prFields[0]),
                va: Object.keys(vaFields[0]),
                un: Object.keys(unFields[0]),
            }
        })
    }
}