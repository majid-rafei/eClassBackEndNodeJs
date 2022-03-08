import PrismaService from "../../common/services/prisma.service";
const prisma = PrismaService.getPrisma();

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
            case 'eclass7_pr_va':
                _prisma = prisma.eclass7_pr_va;
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
}