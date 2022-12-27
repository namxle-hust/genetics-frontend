export const PageSizes = [5, 10, 30, 60, 100];

export interface IPaginatorState {
    page: number;
    pageSize: number;
    total: number;
    recalculatePaginator(total: number): IPaginatorState;
}

export class PaginatorState implements IPaginatorState {
    page = 1;
    pageSize = PageSizes[0];
    total = 0;
    pageSizes: number[] = [];

    recalculatePaginator(total: number): PaginatorState {
        this.total = total;
        return this;
    }
}

export interface IPaginatorView {
    paginator: PaginatorState;
    ngOnInit(): void;
    paginate(paginator: PaginatorState): void;
}
