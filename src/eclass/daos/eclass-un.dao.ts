import {eclass7_un} from "@prisma/client";
import PrismaService from '../../common/services/prisma.service';
const prisma = PrismaService.getPrisma();

export class EclassUnDao {
    
    async getMany(conditions: any, count: number = 100): Promise<eclass7_un[]> {
        return prisma.eclass7_un.findMany({
            take: count,
            where: {
            
            }
        }).catch((error: any) => {
            throw new Error(error.message);
        });
    }
}