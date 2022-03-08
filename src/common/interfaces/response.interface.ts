export interface FinalResponse {
    done: boolean;
    msg: string;
    data?: ResponseData;
}

export interface ResponseData {
    item?: any;
    items?: any;
    id?: number;
}