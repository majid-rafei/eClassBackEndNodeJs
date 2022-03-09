export interface EclassFilters {
    tx?: string,
    cl?: ColumnQuery,
    pr?: ColumnQuery,
    va?: ColumnQuery,
    un?: ColumnQuery,
}

export interface ColumnQuery {
    c: string,
    q: string,
}

export interface EclassFilterParams {
    c: string,
    q: string,
    table: string,
    alias: string,
    fields: [],
    relation?: string,
}