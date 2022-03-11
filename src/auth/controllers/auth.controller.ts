import debug from 'debug';
import express from "express";
import {JwtService} from "../services/jwt.service";
import responseService from "../../common/services/response.service";
import {StatusCodes} from "http-status-codes";

const log: debug.IDebugger = debug('app:auth-controller');

class AuthController {
    
    /**
     * For user login.
     * @param req
     * @param res
     */
    async createJwt(req: express.Request, res: express.Response) {
        let jwt;
        log(jwt = (new JwtService()).createJwt(req.body));
        jwt
            .then((jwt) => {
                let resp = responseService.rsp({item: jwt});
                res.status(StatusCodes.CREATED).send(resp);
            })
            .catch((error) => {
                const err = responseService.err('Error in creating jwt: ' + error.message);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            });
    };
}

export default new AuthController();