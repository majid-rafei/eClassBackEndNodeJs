import {eclass7_va} from "@prisma/client";
import PrismaService from '../../common/services/prisma.service';
const prisma = PrismaService.getPrisma();

export class EclassVaDao {
    
    async getMany(conditions: any, count: number = 100): Promise<eclass7_va[]> {
        return prisma.eclass7_va.findMany({
            take: count,
            where: {
            
            }
        }).catch((error: any) => {
            throw new Error(error.message);
        });
    }
}