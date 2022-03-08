import {FinalResponse, ResponseData} from "../interfaces/response.interface";

class ResponseService {
    /**
     * Is the no error response for every service method.
     * @param data
     * @param msg
     */
    rsp (data: ResponseData, msg?: string): FinalResponse {
        return {
            done: true,
            msg: msg ? msg : 'Successfully done',
            data: data,
        }
    }
    
    /**
     * Is the error response for every service method.
     * @param msg
     * @param data
     */
    err (msg: string, data?: ResponseData): FinalResponse {
        return {
            done: false,
            msg: msg,
            data: data,
        }
    }
}

export default new ResponseService();