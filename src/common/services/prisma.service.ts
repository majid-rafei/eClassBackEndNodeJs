import {PrismaClient} from '@prisma/client';
import debug from 'debug';

const log: debug.IDebugger = debug('app:prisma-service');

class PrismaService {
    
    private count: number = 0;
    private prisma: any;
    
    constructor() {
        this.connectWithRetry();
    }
    
    getPrisma() {
        return this.prisma;
    }
    
    connectWithRetry = () => {
        log('Attempting Prisma connection (will retry if needed)');
        return new Promise <PrismaClient> (() => {
                this.prisma = new PrismaClient();
                console.log('DB is connected')
                return this.prisma;
            })
            .then(() => {
                log('DB is connected');
            })
            .catch((err) => {
                const retrySeconds = 5;
                log(
                    `MongoDB connection unsuccessful (will retry #${++this
                        .count} after ${retrySeconds} seconds):`,
                    err
                );
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
    };
}

export default new PrismaService();
