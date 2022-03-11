import {UserInterface} from "./user.interface";

export interface CRUD {
    create: (resource: any) => Promise<number>;
    getById: (id: number) => Promise<UserInterface>;
    getAll: (limit: number, page: number) => Promise<UserInterface[]>;
    updateById: (id: number, resource: any) => Promise<number>;
    deleteById: (id: number) => Promise<boolean>;
}