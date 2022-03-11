import {FinalResponseInterface} from "../../common/interfaces/response.interface";
import responseService from "../../common/services/response.service";
import {EclassClDao} from "../daos/eclass-cl.dao";
import {EclassFilterParams, EclassFilters} from "../../common/interfaces/filters.interface";
import {EclassPrDao} from "../daos/eclass-pr.dao";
import {EclassVaDao} from "../daos/eclass-va.dao";
import {TableFieldsService} from "./table-fields.service";
import {EclassUnDao} from "../daos/eclass-un.dao";

export interface Item {
    clVal: any,
    prVal?: any,
    vaVals?: any[],
    unVals?: any[],
}

export interface PrintConditions {
    cl: boolean,
    pr: boolean,
    va: boolean,
    un: boolean,
}

export class SearchEclassService {
    
    async getStructuredData(filters: EclassFilters): Promise<FinalResponseInterface> {
        let structure = {};
        
        // Set filter conditions for all types
        let canPrint = this._setPrintConditions(filters);
        
        // Get fields of all tables
        let _fields: FinalResponseInterface = await (new TableFieldsService()).getFieldsOfAllTables();
        let fields = _fields.data?.items;
        
        // Set conditions for Class search
        let clParams = this._setFilterParams('cl', filters, fields);
        
        // Search for Classes
        let clList = await (new EclassClDao()).getManyRaw(clParams);
        
        // Set conditions for Property search
        let prParams = this._setFilterParams('pr', filters, fields);
        
        // Iterate over Classes
        for (let clKey in clList) {
            let clVal = clList[clKey];
            
            // Add each Class to the final structure
            if (canPrint.cl) {
                structure = this._prepareStructure(structure, {
                    clVal: clVal,
                });
            }
            
            // Search for Properties of each Class
            prParams.relation = clVal.IrdiCC;
            let prList = await (new EclassPrDao()).getManyRaw(prParams);
            
            // Set conditions for Value search
            let vaParams = this._setFilterParams('va', filters, fields);
            
            // Set conditions for Unit search
            let unParams = this._setFilterParams('un', filters, fields);
            
            // Iterate over Properties
            for (let prKey in prList) {
                let prVal = prList[prKey];
    
                // Add each Property to the final structure
                if (canPrint.pr) {
                    structure = this._prepareStructure(structure, {
                        clVal: clVal,
                        prVal: prVal,
                    });
                }
                
                if (canPrint.va) {
                    vaParams.relation = prList[prKey].IrdiPR;
                    let vaList = await (new EclassVaDao()).getManyRaw(vaParams);
    
                    // Add Value list to the final structure
                    if (vaList.length > 0) {
                        structure = this._prepareStructure(structure, {
                            clVal: clVal,
                            prVal: prVal,
                            vaVals: vaList,
                        });
                    }
                }
    
                if (canPrint.un) {
                    unParams.relation = prList[prKey].IrdiPR;
                    let unList = await (new EclassUnDao()).getManyRaw(unParams);
                    
                    // Add Unit list to the final structure
                    if (unList.length > 0) {
                        structure = this._prepareStructure(structure, {
                            clVal: clVal,
                            prVal: prVal,
                            unVals: unList,
                        });
                    }
                }
            }
        }
        let result = this._convertStructureToArray(structure);
        return responseService.rsp({items: result});
    }
    
    /**
     * To initialize filter params
     * @param params
     */
    private _initializeFilterParams(params: any = {}): EclassFilterParams {
        return {
            c: params.c ? params.c : '',
            q: params.q ? params.q : '',
            table: params.table ? params.table : '',
            alias: params.alias ? params.alias : '',
            fields: params.fields ? params.fields : [],
            relation: params.relation ? params.relation : '',
        }
    }
    
    /**
     * This function prepares and pushes new items into the final structure.
     * @param structure
     * @param item
     * @private
     */
    private _prepareStructure(
        structure: any,
        item: Item
    ) {
        // If Class is not given
        if (! item.clVal) {
            return structure;
        }
        
        let clId = item.clVal.IrdiCC;
        
        // If structure has not the class key, then it is added
        if (! structure[clId]) {
            structure[clId] = {
                data: item.clVal,
                name: item.clVal.PreferredName,
                type: 'cl',
                children: {},
            }
        }
        
        // If Property is not given.
        if (! item.prVal) {
            return structure;
        }
        
        let prId = item.prVal.IrdiPR;
        
        // Adding property as the class child
        if (! structure[clId].children[prId]) {
            structure[clId].children[prId] = {
                data: item.prVal,
                name: item.prVal.PreferredName,
                type: 'pr',
                children: {},
            }
        }
        
        // Adding value as the property child
        if (item.vaVals && item.vaVals.length > 0) {
            for (let value of item.vaVals) {
                let vaId = value.IrdiVA;
                structure[clId].children[prId].children[vaId] = {
                    name: value.PreferredName,
                    type: 'va',
                    data: value,
                    children: {},
                }
            }
        }
        
        // Adding unit as the property child
        if (item.unVals && item.unVals?.length > 0) {
            for (let unit of item.unVals) {
                let unId = unit.IrdiUN;
                structure[clId].children[prId].children[unId] = {
                    name: unit.StructuredNaming,
                    type: 'un',
                    data: unit,
                    children: {},
                }
            }
        }
        return structure;
    }
    
    private _setFilterParams(type: string, filters: EclassFilters, fields: any): EclassFilterParams {
        // Default is to search all fields, search will be restricted if a filter is given.
        let params = Object.assign({}, this._initializeFilterParams());
        let _filters: any;
        switch (type) {
            case 'cl':
                _filters = !!filters.cl ? filters.cl : {};
                params.fields = !!fields.cl ? fields.cl : [];
                params.c = (_filters.c && fields.cl.indexOf(_filters.c) > -1) ? _filters.c : '';
                break;
            case 'pr':
                _filters = !!filters.pr ? filters.pr : {};
                params.fields = !!fields.pr ? fields.pr : [];
                params.c = (!!_filters.c && fields.pr.indexOf(_filters.c) > -1) ? _filters.c : '';
                break;
            case 'va':
                _filters = !!filters.va ? filters.va : {};
                params.fields = !!fields.va ? fields.va : [];
                params.c = (!!_filters.c && fields.va.indexOf(_filters.c) > -1) ? _filters.c : '';
                break;
            case 'un':
                _filters = !!filters.un ? filters.un : {};
                params.fields = !!fields.un ? fields.un : [];
                params.c = (!!_filters.c && fields.un.indexOf(_filters.c) > -1) ? _filters.c : '';
                break;
        }
        params.q = !!_filters.q ? _filters.q : '';
    
        return params;
    }
    
    /**
     * this function determines if a type can be printed to the result or not.
     * @param filters
     * @private
     */
    private _setPrintConditions(filters: EclassFilters): PrintConditions {
        let conditions: PrintConditions = {cl: false, pr: false, va: false, un: false};
        let zeroCondition: boolean = !(filters.cl?.q) && !(filters.pr?.q) && !(filters.va?.q) && !(filters.un?.q);
        conditions.cl = !!(filters.cl?.q) && !(filters.pr?.q) && !(filters.va?.q) && !(filters.un?.q);
        conditions.cl = conditions.cl || zeroCondition;
        conditions.pr = !!(filters.pr?.q) && !(filters.va?.q) && !(filters.un?.q);
        conditions.pr = conditions.pr || zeroCondition;
        conditions.va = !(!(filters.va?.q) && !!(filters.un?.q));
        conditions.va = conditions.va || zeroCondition;
        conditions.un = !(!!(filters.va?.q) && !(filters.un?.q));
        conditions.un = conditions.un || zeroCondition;
        return conditions;
    }
    
    /**
     * Checks if the object is defined and not null
     * @param obj
     * @private
     */
    private _isDefined(obj: any): boolean {
        return (typeof obj !== 'undefined') && (obj !== null);
    }
    
    /**
     * Converts structure object to array for easier process in front
     * @param structure
     * @private
     */
    private _convertStructureToArray(structure: any) {
        let array: any[] = [];
        let emptyArray: any[] = [];
        let i = 0;
        let j = 0;
        let k = 0;
        for (let _cl in structure) {
            let cl: any = structure[_cl];
            array[i] = {
                data: cl.data ? cl.data : {},
                name: cl.name ? cl.name : '',
                type: cl.type ? cl.type : '',
                children: Object.assign([], emptyArray)
            };
            if (cl.children.length == 0) continue;
            for (let _pr in cl.children) {
                let pr: any = cl.children[_pr];
                let prObj: any = {
                    data: pr.data ? pr.data : {},
                    name: pr.name ? pr.name : '',
                    type: pr.type ? pr.type : '',
                    children: Object.assign([], emptyArray),
                };
                array[i].children[j] = Object.assign([], emptyArray);
                array[i].children[j] = prObj;
                for (let _child in pr.children) {
                    let child: any = pr.children[_child];
                    let childObj: any = {
                        data: child.data ? child.data : {},
                        name: child.name ? child.name : '',
                        type: child.type ? child.type : '',
                    };
                    array[i].children[j].children[k] = Object.assign([], emptyArray);
                    array[i].children[j].children[k] = childObj;
                    k++;
                }
                k = 0;
                j++;
            }
            j = 0;
            i++;
        }
        return array;
    }
}