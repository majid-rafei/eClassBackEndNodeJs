import PrismaService from "../../common/services/prisma.service";
import {EclassFilterParams} from "../../common/interfaces/filters.interface";
const prisma = PrismaService.getPrisma();
let validator = require('validator');

export class EclassDao {
    /**
     * This function is for inserting entries into database
     * @param tableName
     * @param entries
     */
    async createMany(entries: any[], tableName: string): Promise<boolean | string> {
        let _prisma: any;
        switch (tableName) {
            case 'eclass7_cc':
                _prisma = prisma.eclass7_cc;
                break;
            case 'eclass7_pr':
                _prisma = prisma.eclass7_pr;
                break;
            case 'eclass7_cc_pr':
                _prisma = prisma.eclass7_cc_pr;
                break;
            case 'eclass7_va':
                _prisma = prisma.eclass7_va;
                break;
            case 'eclass7_un':
                _prisma = prisma.eclass7_un;
                break;
            case 'eclass7_cc_pr_va':
                _prisma = prisma.eclass7_cc_pr_va;
                break;
        }
        return _prisma.createMany({
            data: entries,
            skipDuplicates: true,
        }).then((resp: any) => {
            return true;
        }).catch((error: any) => {
            return error.message;
        })
    }
    
    /**
     * This method sets filters provided from input argument `params`.
     * If you want to search all fields of the table, then provide `params.q` and not `params.c`,
     * finally, if you want to search only one field, then provide both `params.c` and `params.q`.
     * @param query
     * @param params
     */
    addFilters(query: string, params: EclassFilterParams) {
        // If no search string is provided
        if (!params.q) return query;
        // If column (table field) is specified
        if (!!params.c) {
            query += `and (${params.alias}."${params.c}" like '%${validator.escape(params.q)}%') `;
        }
        // Column (table field) is not specified, so, search all fields
        else {
            query += "and ( ";
            for (let key in params.fields) {
                query += `${params.alias}."${params.fields[key]['col']}" like '%${validator.escape(params.q)}%' or `;
            }
            // To remove last extra ' or' and close the parenthesis
            query = query.substring(0, query.length - 3) + ") ";
        }
        return query;
    }
}