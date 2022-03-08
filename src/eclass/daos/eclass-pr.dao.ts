import {eclass7_pr} from "@prisma/client";
import PrismaService from '../../common/services/prisma.service';
const prisma = PrismaService.getPrisma();

export class EclassPrDao {
    
    async getMany(conditions: any, count: number = 100): Promise<eclass7_pr[]> {
        return prisma.eclass7_pr.findMany({
            take: count,
            where: {
            
            }
        }).catch((error: any) => {
            throw new Error(error.message);
        });
    }
}