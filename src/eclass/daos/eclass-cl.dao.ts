import {eclass7_cc} from "@prisma/client";
import PrismaService from '../../common/services/prisma.service';
import {EclassDao} from "./eclass.dao";
import {EclassFilterParams} from "../../common/interfaces/filters.interface";
const prisma = PrismaService.getPrisma();
const table = "eclass7_cc";
const alias = 'cl';

export class EclassClDao {
    
    async getMany(conditions: any, count: number = 1000): Promise<eclass7_cc[]> {
        let filters: any = {};
        if (conditions.field && conditions.field.c && conditions.field.q) {
            filters[conditions.field.c] = {
                contains: conditions.field.q,
            };
        }
        return prisma.eclass7_cc.findMany({
            take: count,
            where: filters
        }).catch((error: any) => {
            throw new Error(error.message);
        });
    }
    
    /**
     * Gets a list of Classes with a raw SQL
     * @param params
     */
    async getManyRaw(params: EclassFilterParams): Promise<eclass7_cc[]> {
        let query = `select distinct cl.* from ${table} as ${alias} where 1=1 `;
        params.table = table;
        params.alias = alias;
        query = (new EclassDao()).addFilters(query, params);
        return await prisma.$queryRawUnsafe(query);
    }
}