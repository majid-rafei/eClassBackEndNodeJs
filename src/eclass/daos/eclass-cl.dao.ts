import {eclass7_cc} from "@prisma/client";
import PrismaService from '../../common/services/prisma.service';
const prisma = PrismaService.getPrisma();

export class EclassClDao {
    
    async getMany(conditions: any, count: number = 100): Promise<eclass7_cc[]> {
        return prisma.eclass7_cc.findMany({
            take: count,
            where: {
            
            }
        }).catch((error: any) => {
            throw new Error(error.message);
        });
    }
}