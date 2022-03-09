import {eclass7_pr} from "@prisma/client";
import PrismaService from '../../common/services/prisma.service';
import {EclassFilterParams} from "../../common/interfaces/filters.interface";
import {EclassDao} from "./eclass.dao";
const prisma = PrismaService.getPrisma();
const table = "eclass7_pr";
const alias = 'pr';
const relationTable = 'eclass7_cc_pr';
const relationAlias = 'ccpr';

export class EclassPrDao {
    
    async getMany(conditions: any, count: number = 100): Promise<eclass7_pr[]> {
        let filters: any = {};
        if (conditions.field && conditions.field.c && conditions.field.q) {
            filters[conditions.field.c] = {
                contains: conditions.field.q,
            };
        }
        return prisma.eclass7_pr.findMany({
            take: count,
            where: filters,
        }).catch((error: any) => {
            throw new Error(error.message);
        });
    }
    
    /**
     * Gets a list of Properties with a raw SQL
     * @param params
     */
    async getManyRaw(params: EclassFilterParams) {
        let query = `select distinct ${alias}.* from ${table} as ${alias} `;
        query += `left join ${relationTable} as ${relationAlias} on ${alias}."IrdiPR" = ${relationAlias}."IrdiPR" `
        query += `where (${relationAlias}."IrdiCC" = '${params.relation}') `
        params.table = table;
        params.alias = alias;
        query = (new EclassDao()).addFilters(query, params);
        return await prisma.$queryRawUnsafe(query);
    }
}