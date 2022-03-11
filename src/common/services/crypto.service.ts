import {BinaryToTextEncoding} from "crypto";
let crypto: any;
try {
    crypto = require('crypto');
}
catch (err) {
    console.log('crypto support is disabled!');
}

const _algorithm: string = "sha512";
const _encoding: BinaryToTextEncoding = "base64";
const _rndBytes: number = 16;

export class CryptoService {
    
    /**
     * Gets hash giving salt and pass
     * @param algorithm
     * @param salt
     * @param secret
     * @param encoding
     */
    createHash(salt: string, secret: string, algorithm: string = _algorithm, encoding: BinaryToTextEncoding = _encoding): string {
        return crypto
            .createHmac(algorithm, salt)
            .update(secret)
            .digest(encoding);
    }
    
    /**
     * Gets a salt.
     * @param rndBytes
     */
    createSaltObject(rndBytes: number = _rndBytes): string {
        return crypto
            .randomBytes(_rndBytes).toString(_encoding);
    }
    
    /**
     * Gets the default encoding.
     */
    getDefaultEncoding(): BinaryToTextEncoding {
        return _encoding;
    }
}