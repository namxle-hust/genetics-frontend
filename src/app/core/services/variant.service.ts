import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GroupingState, ITableState, PageSizes, PaginatorState, SortState } from 'src/app/shared/crud-table';
import { TableService } from 'src/app/shared/crud-table/services/table.service';
import { VariantModel } from '../models';
import { ApiService } from './api.service';


@Injectable()
export class VariantService extends TableService<VariantModel> {

    private path = 'analysis/variants';

    analysisIdSubject: BehaviorSubject<number>
    analysisId$: Observable<number>

    get analysisId() {
        return this.analysisIdSubject.value
    }

    set analysisId(value: number) {
        this.analysisIdSubject.next(value)
    }

    constructor(apiService: ApiService) {
        let state: ITableState = {
            filter: {},
            paginator: new PaginatorState(PageSizes[3]),
            sorting: new SortState(),
            searchTerm: '',
            grouping: new GroupingState(),
            entityId: undefined
        };
        super('analysis/variants/', apiService, state)

        this.analysisIdSubject = new BehaviorSubject<number>(0)
        this.analysisId$ = this.analysisIdSubject.asObservable();

        this.analysisId$.subscribe((value: number) => {
            this.endpoint = `${this.path}/${value}`;
        })
    }

    public patchStateReset() {
        let patchReset = {
            filter: {},
            paginator: new PaginatorState(PageSizes[3]),
            sorting: new SortState(),
            searchTerm: '',
            grouping: new GroupingState(),
            entityId: undefined
        };
        this.patchStateWithoutFetch(patchReset);
    }
    
}
