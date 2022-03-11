import {ValidationError} from "express-validator";
import {ErrorDataInterface, FinalResponseInterface, ResponseDataInterface} from "../interfaces/response.interface";

class ResponseService {
    /**
     * Is the no error response for every service method.
     * @param data
     * @param msg
     */
    rsp (data: ResponseDataInterface, msg?: string): FinalResponseInterface {
        return {
            done: true,
            msg: msg ? msg : 'Successfully done',
            data: data,
        }
    }
    
    /**
     * Is the error response for every service method.
     * @param msg
     * @param errorData
     */
    err (msg: string, errorData?: ErrorDataInterface | ValidationError[]): FinalResponseInterface {
        return {
            done: false,
            msg: msg,
            error: errorData,
        }
    }
}

export default new ResponseService();