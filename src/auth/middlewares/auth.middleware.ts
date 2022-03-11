import express from "express";
import {validationResult} from "express-validator";
import {StatusCodes} from "http-status-codes";
import usersService from "../../users/services/users.service";
import {UserWithCredentialsInterface} from "../../common/interfaces/user.interface";
import responseService from "../../common/services/response.service";
import {CryptoService} from "../../common/services/crypto.service";
let crypto;
try {
    crypto = require('crypto');
}
catch (err) {
    console.log('crypto support is disabled!');
}

class AuthMiddleware {
    
    async verifyUserPassword(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user: UserWithCredentialsInterface = await usersService
            .getCredentialsByEmail(req.body.email);
        if (! user) {
            let err = responseService.err(`User ${req.body.email} not found`);
            return res.status(StatusCodes.NOT_FOUND).send(err);
        }
        let pass = user.password;
        let hash = (new CryptoService()).createHash(user.salt, req.body.password);
        if (hash !== pass) {
            let err = responseService.err(`User credentials are invalid`);
            return res.status(StatusCodes.UNAUTHORIZED).send(err);
        }
        req.body = {
            userId: user.id,
            email: user.email,
            permissionLevel: user.permissionLevel,
            provider: 'email',
            name: user.firstName + ' ' + user.lastName,
        };
        return next();
    }
}

export default new AuthMiddleware();