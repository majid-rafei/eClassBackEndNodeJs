import express from 'express';
import jwt, {Jwt} from 'jsonwebtoken';
import usersService from '../../users/services/users.service';
import {StatusCodes} from "http-status-codes";
import responseService from "../../common/services/response.service";
import {CryptoService} from "../../common/services/crypto.service";

// @ts-expect-error
const _jwtSecret: string = process.env.JWT_SECRET;

class JwtMiddleware {
    
    /**
     * Checks if refreshToken is provided or not.
     * @param req
     * @param res
     * @param next
     */
    verifyRefreshBodyField(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.refreshToken) {
            return next();
        }
        let err = responseService.err(`Missing required field: refreshToken`);
        return res.status(StatusCodes.UNAUTHORIZED).send(err);
    }
    
    /**
     * Validates refresh token
     * @param req
     * @param res
     * @param next
     */
    async validateRefreshToken(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user: any = await usersService.getCredentialsByEmail(
            res.locals.jwt.email
        );
        const salt = res.locals.jwt.refreshKey;
        const refreshId = res.locals.jwt.userId + _jwtSecret;
        const hash = (new CryptoService()).createHash(salt, refreshId)
        if (hash !== req.body.refreshToken) {
            const err = responseService.err(`Invalid refresh token`);
            return res.status(StatusCodes.BAD_REQUEST).send(err);
        }
        req.body = {
            userId: user._id,
            email: user.email,
            permissionFlags: user.permissionFlags,
        };
        console.log('refresh token is valid')
        return next();
    }
    
    /**
     * Validates Jwt
     * @param req
     * @param res
     * @param next
     */
    validateJwt(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (!req.headers['authorization']) {
            const err = responseService.err(`Authorization header is not provided.`);
            return res.status(StatusCodes.UNAUTHORIZED).send(err);
        }
        try {
            const authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                const err = responseService.err(`Bearer authorization header needed.`);
                return res.status(StatusCodes.UNAUTHORIZED).send(err);
            }
            res.locals.jwt = jwt.verify(authorization[1], _jwtSecret) as Jwt;
            next();
        } catch (error) {
            const err = responseService.err(`Error validating Jwt.`);
            return res.status(StatusCodes.FORBIDDEN).send(err);
        }
    }
}

export default new JwtMiddleware();
