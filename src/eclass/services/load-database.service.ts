import {ReadCsvService} from "../../common/services/read-csv.service";
import {
    eclass7_cc,
    eclass7_pr,
    eclass7_cc_pr,
    eclass7_va,
    eclass7_un,
    eclass7_cc_pr_va
} from "@prisma/client";
import * as fs from "fs";
import {environment} from "../../../environments/environment";
import responseService from "../../common/services/response.service";
import {EclassDao} from "../daos/eclass.dao";
export interface ImportResult {
    fileName: string,
    msg: string,
    done: boolean,
}

export class LoadDatabaseService {
    /**
     * Seeds the database with the initial data getting from CSV files in the `data` directory of the project
     */
    async initializeDatabase(): Promise<any> {
        let directoryPath: string = process.cwd() + environment.CSV_DATA_PATH; //'/data/csv'
        const files = fs.readdirSync(directoryPath); //, {withFileTypes: true}
        let reader = new ReadCsvService();
        let filePath: string = '';
        let result: ImportResult[] = [];
        for (let fileKey in files) {
            let fileName = files[fileKey];
            // Check if file is a csv file
            let ext = environment.CSV_DEFAULT_EXTENSION;
            if (fileName.slice(-1 * ext.length) != ext) {
                continue;
            }
            let delimiter = environment.CSV_DEFAULT_DELIMITER;
            filePath = directoryPath + '/' + fileName;
            await reader
                .readFileContent(filePath, delimiter)
                .then(async (resp: any) => {
                    if (typeof resp == 'string') {
                        result.push(this._setResultOfImport(fileName, '', false))
                        return false;
                    }
                    else if (Object.prototype.toString.call(resp) === '[object Array]') {
                        let isImported = await this.importIntoDatabase(resp);
                        if (typeof isImported == 'string') {
                            result.push(this._setResultOfImport(fileName, isImported, false))
                            return false;
                        }
                        result.push(this._setResultOfImport(fileName, '', true))
                        return true;
                    }
                    else {
                        result.push(this._setResultOfImport(fileName, '', false))
                        return false;
                    }
                }).catch((error: any) => {
                    result.push(this._setResultOfImport(fileName, '', false))
                    return false;
                })
        }
        return responseService.rsp({items: result});
    }
    
    /**
     * This function inserts array of entries into specified table.
     * @param entries
     * @param tableName
     */
    async importIntoDatabase(entries: any[], tableName: string = ''): Promise<any> {
        if (tableName == '') {
            tableName = this.findTableName(entries[0]);
        }
        if (tableName == '') {
            return 'Headers are not compatible with any table of simple E-Class system';
        }
        return (new EclassDao()).createMany(entries, tableName)
            .catch((error) => {
                return error.message;
            });
    }
    
    /**
     * Finds table name according to the item type.
     * @param item
     */
    findTableName(item: any): string {
        let tableName: string = '';
        if (this.isEclassCc(item)) tableName = 'eclass7_cc';
        else if (this.isEclassPr(item)) tableName = 'eclass7_pr';
        else if (this.isEclassCcPr(item)) tableName = 'eclass7_cc_pr';
        else if (this.isEclassVa(item)) tableName = 'eclass7_va';
        else if (this.isEclassUn(item)) tableName = 'eclass7_un';
        else if (this.isEclassCcPrVa(item)) tableName = 'eclass7_cc_pr_va';
        return tableName;
    }
    
    /**
     * Checks if item has the Class type.
     * @param item
     */
    isEclassCc(item: any): item is eclass7_cc {
        return (item as eclass7_cc).IrdiCC !== undefined
            && (item as eclass7_cc).Supplier !== undefined;
    }
    
    /**
     * Checks if item has the Property type
     * @param item
     */
    isEclassPr(item: any): item is eclass7_pr {
        return (item as eclass7_pr).IrdiPR !== undefined
            && (item as eclass7_pr).IrdiUN !== undefined
            && (item as eclass7_pr).Supplier !== undefined;
    }
    
    /**
     * Checks if item has the Class-Property type
     * @param item
     */
    isEclassCcPr(item: any): item is eclass7_cc_pr {
        return (item as eclass7_cc_pr).IrdiCC !== undefined
            && (item as eclass7_cc_pr).IdCC !== undefined
            && (item as eclass7_cc_pr).IrdiPR !== undefined
            && (item as eclass7_cc_pr).IdPR !== undefined;
    }
    
    /**
     * Checks if item has the Value type
     * @param item
     */
    isEclassVa(item: any): item is eclass7_va {
        return (item as eclass7_va).IrdiVA !== undefined
            && (item as eclass7_va).Supplier !== undefined;
    }
    
    /**
     * Checks if item has the Unit type
     * @param item
     */
    isEclassUn(item: any): item is eclass7_un {
        return (item as eclass7_un).IrdiUN !== undefined
            && (item as eclass7_un).StructuredNaming !== undefined;
    }
    
    /**
     * Checks if item has the Class-Property-Value type
     * @param item
     */
    isEclassCcPrVa(item: any): item is eclass7_cc_pr_va {
        return (item as eclass7_cc_pr_va).IrdiPR !== undefined
            && (item as eclass7_cc_pr_va).IrdiVA !== undefined
            && (item as eclass7_cc_pr_va).IrdiCC !== undefined;
    }
    
    /**
     * Sets the result of each data insertion
     * @param fileName
     * @param msg
     * @param done
     */
    private _setResultOfImport(fileName: string, msg: string = '', done: boolean) {
        if (msg == '') {
            if (done) msg = 'Done successfully';
            else msg = 'Headers are not compatible with any table of simple E-Class system';
        }
        return {
            fileName: fileName,
            msg: msg,
            done: done
        }
    }
}