import * as fs from "fs";
import {parse} from 'csv-parse';

export class ReadCsvService {
    
    async readFileContent(filePath: string, delimiter: string = ';'): Promise<any> {
        return new Promise((resolve, reject) => {
            let fileContent = '';
            if (fs.existsSync(filePath)) {
                // File exists in path
                fileContent = fs.readFileSync(filePath, {encoding: 'utf-8'});
            } else {
                // File doesn't exist in path
                return 'File does not exist!';
            }
            parse(fileContent, {
                bom: true,
                // cast: true,
                delimiter: delimiter,
                columns: true,
                trim: true,
                relax_column_count_less: true,
                relax_column_count_more: true,
                skip_empty_lines: true,
                skip_records_with_empty_values: true,
                
            }, (error: any, result: any) => {
                if (error) {
                    reject(error.message);
                }
                resolve(result);
            })
        })
    }
}