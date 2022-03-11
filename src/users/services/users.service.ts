import UsersDao from '../daos/users.dao';
import {CRUD} from '../../common/interfaces/crud.interface';
import {CreateUserDto} from '../dto/create.user.dto';
import {UpdateUserDto} from '../dto/updateUserDto';
import moment from "moment";
import {UserInterface, UserWithCredentialsInterface} from "../../common/interfaces/user.interface";
import {CryptoService} from "../../common/services/crypto.service";

let crypto: any;
try {
    crypto = require('crypto');
} catch (err) {
    console.log('crypto support is disabled!');
}

class UsersService implements CRUD {
    
    /**
     * Creates user.
     * @param resource
     */
    async create(resource: CreateUserDto): Promise<number> {
        let cryptoService = new CryptoService();
        let salt = cryptoService.createSaltObject();
        let hash = cryptoService.createHash(salt, resource.password);
        resource.salt = salt;
        resource.password = hash;
        resource.permissionLevel = 1;
        resource.createdAt = moment().toDate();
        return UsersDao
            .create(resource)
            .catch((error) => {
                throw new Error(error.message);
            });
    }
    
    /**
     * Gets user by id.
     * @param id
     */
    async getById(id: number): Promise<UserInterface> {
        return UsersDao
            .getById(Number(id))
            .catch(error => {
                throw new Error(error.message);
            });
    }
    
    /**
     * Gets user by email.
     * @param email
     */
    async getByEmail(email: string): Promise<UserInterface> {
        return UsersDao
            .getByEmail(email)
            .catch(error => {
                throw new Error(error.message);
            });
    }
    
    /**
     * Gets user by email. Please consider that result contains password and salt.
     * TODO: This method needs admin access.
     * @param email
     */
    async getCredentialsByEmail(email: string): Promise<UserWithCredentialsInterface> {
        return UsersDao
            .getCredentialsByEmail(email)
            .catch(error => {
                throw new Error(error.message);
            });
    }
    
    /**
     * Gets all users.
     * @param limit
     * @param page
     */
    async getAll(limit: number, page: number): Promise<UserInterface[]> {
        return UsersDao
            .getAll()
            .catch((error) => {
                throw new Error(error.message);
            });
    }
    
    /**
     * Updates user by id.
     * @param id
     * @param resource
     */
    async updateById(id: number, resource: UpdateUserDto): Promise<number> {
        if (resource.password) {
            let cryptoService = new CryptoService();
            let salt = cryptoService.createSaltObject();
            let hash = cryptoService.createHash(salt, resource.password);
            resource.salt = salt;
            resource.password = hash;
        }
        return UsersDao
            .updateById(id, resource)
            .catch((error) => {
                throw new Error(error.message);
            });
    }
    
    /**
     * Deletes user by id.
     * @param id
     */
    async deleteById(id: number): Promise<boolean> {
        return UsersDao
            .deleteById(id)
            .catch((error) => {
                throw new Error(error.message);
            });
    }
}

export default new UsersService();