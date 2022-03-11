import {ValidationError} from "express-validator";

export interface FinalResponseInterface {
    done: boolean;
    msg: string;
    data?: ResponseDataInterface;
    error?: ErrorDataInterface | ValidationError[];
}

export interface ResponseDataInterface {
    item?: any;
    items?: any[];
}

export interface ErrorDataInterface {
    msg?: string;
    code?: number;
    param?: string;
    location?: string;
}