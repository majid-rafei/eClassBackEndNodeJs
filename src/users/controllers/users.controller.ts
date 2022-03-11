import express from 'express';
import usersService from '../services/users.service';
import debug from 'debug';
import {StatusCodes} from 'http-status-codes';
import responseService from "../../common/services/response.service";
import {UserInterface} from "../../common/interfaces/user.interface";

const log: debug.IDebugger = debug('app:users-controller');

class UsersController {
    
    constructor() {
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.updateById = this.updateById.bind(this);
        this.deleteById = this.deleteById.bind(this);
    }
    
    /**
     * Creates new user.
     * @param req
     * @param res
     */
    async create(req: express.Request, res: express.Response) {
        let create;
        log(create = usersService.create(req.body));
        create
            .then((id: number) => {
                let resp = responseService.rsp({item: id}, 'Successfully created.');
                res.status(StatusCodes.CREATED).send(resp);
            })
            .catch((error) => {
                const err = responseService.err(error.message);
                res.status(StatusCodes.BAD_REQUEST).send(err);
            });
    }
    
    /**
     * Gets user by id.
     * @param req
     * @param res
     */
    async getById(req: express.Request, res: express.Response) {
        let read;
        log(read = usersService.getById(Number(req.body.id)));
        read
            .then((user: UserInterface) => {
                let resp = responseService.rsp({item: user});
                res.status(StatusCodes.OK).send(resp);
            })
            .catch((error) => {
                const err = responseService.err(error.message);
                res.status(StatusCodes.BAD_REQUEST).send(err);
            });
    }
    
    /**
     * Gets all users.
     * @param req
     * @param res
     */
    async getAll(req: express.Request, res: express.Response) {
        let list: any;
        log(list = usersService.getAll(100, 0));
        list
            .then((users: UserInterface[]) => {
                let resp = responseService.rsp({items: users});
                res.status(StatusCodes.OK).send(resp);
            })
            .catch((error: any) => {
                const err = responseService.err(error.message);
                res.status(StatusCodes.BAD_REQUEST).send(err);
            });
    }
    
    /**
     * Updates user by id.
     * @param req
     * @param res
     */
    async updateById(req: express.Request, res: express.Response) {
        let update;
        log(update = usersService.updateById(Number(req.body.id), req.body));
        update
            .then((id: number) => {
                let resp = responseService.rsp({item: id}, 'Successfully updated.');
                res.status(StatusCodes.OK).send(resp);
            })
            .catch((error) => {
                const err = responseService.err(error.message);
                res.status(StatusCodes.BAD_REQUEST).send(err);
            });
    }
    
    /**
     * Deletes user by id.
     * @param req
     * @param res
     */
    async deleteById(req: express.Request, res: express.Response) {
        let remove;
        log(remove = usersService.deleteById(Number(req.body.id)));
        remove
            .then(() => {
                let resp = responseService.rsp({}, 'Successfully deleted.');
                res.status(StatusCodes.OK).send(resp);
            })
            .catch((error) => {
                const err = responseService.err(error.message);
                res.status(StatusCodes.BAD_REQUEST).send(err);
            });
    }
}

export default new UsersController();