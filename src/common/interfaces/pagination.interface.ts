export interface IPaginationMeta {
    currentPage: number;
    perPage: number;
    total: number;
    totalPages: number;
}

export interface IMetaResponse {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
    currentPage: number;
    previousPage: number | null;
    lastPage: number | null;
    perPage: number;
    total: number;
}

export interface IPaginationOptions {
    take: number;
    skip: number;
}

export interface IPaginationResult<T> {
    items: T[];
    count: number;
}