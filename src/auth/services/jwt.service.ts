import {CryptoService} from "../../common/services/crypto.service";
import {JwtInputInterface, JwtOutputInterface} from "../../common/interfaces/jwt.interface";
import jwt from 'jsonwebtoken';

// @ts-expect-error
const _jwtSecret: string = process.env.JWT_SECRET;
const _tokenExpiresInSeconds: number = Number(process.env.TOKEN_EXPIRES_IN_SECONDS);

export class JwtService {
    
    /**
     * Creates Jwt
     * @param input
     */
    async createJwt(input: JwtInputInterface): Promise<JwtOutputInterface> {
        return new Promise((resolve, reject) => {
            try {
                let refreshId = input.userId + _jwtSecret;
                let cryptoService = new CryptoService();
                let salt = cryptoService.createSaltObject();
                let hash = cryptoService.createHash(salt, refreshId);
                input.refreshKey = salt;
                let accessToken = jwt.sign(input, _jwtSecret, {
                    expiresIn: _tokenExpiresInSeconds,
                });
                resolve({
                    accessToken: accessToken,
                    refreshToken: hash,
                    expiresIn: _tokenExpiresInSeconds
                });
            } catch (e: any) {
                reject(e);
            }
        })
    }
}