import {CreateUserDto} from '../dto/create.user.dto';
import {UpdateUserDto} from '../dto/updateUserDto';
import PrismaService from '../../common/services/prisma.service';
const prisma = PrismaService.getPrisma();
import debug from 'debug';
import {UserInterface, UserWithCredentialsInterface} from "../../common/interfaces/user.interface";

const log: debug.IDebugger = debug('app:users-dao');

class UsersDao {
    
    constructor() {
        log('Created new instance of UsersDao');
    }
    
    /**
     * Creates or inserts user object into User table
     * @param user
     */
    async create(user: CreateUserDto): Promise<number> {
        let conditions: any = {
            data: user,
            select: {id: true}
        };
        return prisma.user.create(conditions)
            .catch((error: any) => {
                throw new Error(error.message);
            })
    }
    
    /**
     * Gets user by id.
     * @param userId
     */
    async getById(userId: number): Promise<UserInterface> {
        let conditions: any = {
            where: {id: userId},
            select: this._selectUserFields(),
        }
        return prisma.user.findUnique(conditions)
            .catch((error: any) => {
                throw new Error(error.message);
            });
    }
    
    /**
     * Gets user by email.
     * @param email
     */
    async getByEmail(email: string): Promise<UserInterface> {
        let conditions: any = {
            where: {email: email},
            select: this._selectUserFields(),
        };
        return prisma.user.findUnique(conditions)
            .catch((error: any) => {
                throw new Error(error.message);
            })
    }
    
    /**
     * Gets user by email. Please consider that result contains password and salt
     * @param email
     */
    async getCredentialsByEmail(email: string): Promise<UserWithCredentialsInterface> {
        let conditions: any = {
            where: {email: email},
        };
        return prisma.user.findUnique(conditions)
            .catch((error: any) => {
                throw new Error(error.message);
            })
    }
    
    /**
     * Gets all users.
     */
    async getAll(): Promise<UserInterface[]> {
        let conditions: any = {
            select: this._selectUserFields(),
        }
        return prisma.user.findMany(conditions)
            .catch((error: any) => {
                throw new Error(error.message);
            });
    }
    
    /**
     * Updates user by user id.
     * @param userId
     * @param user
     */
    async updateById(userId: number, user: UpdateUserDto): Promise<number> {
        let conditions: any = {
            where: {id: userId},
            data: user,
            select: {id: true}
        };
        return prisma.user.update(conditions)
            .catch((error: any) => {
                throw new Error(error.message);
            });
    }
    
    /**
     * Deletes user by id.
     * @param userId
     */
    async deleteById(userId: number): Promise<boolean> {
        let conditions: any = {
            where: {id: userId},
        }
        return prisma.user.delete(conditions)
            .then(() => {
                return true;
            })
            .catch((error: any) => {
                throw new Error(error.message);
            })
    }
    
    /**
     * Returns selected fields of user for fetching.
     * @private
     */
    private _selectUserFields() {
        return {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            permissionLevel: true,
        };
    }
}

export default new UsersDao();
