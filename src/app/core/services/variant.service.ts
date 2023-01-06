import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GroupingState, ITableState, PageSizes, PaginatorState, SortState } from 'src/app/shared/crud-table';
import { TableService } from 'src/app/shared/crud-table/services/table.service';
import { VariantModel } from '../models';
import { ApiService } from './api.service';

const DEFAULT_STATE: ITableState = {
    filter: {},
    paginator: new PaginatorState(PageSizes[3]),
    sorting: new SortState(),
    searchTerm: '',
    grouping: new GroupingState(),
    entityId: undefined
};

@Injectable()
export class VariantService extends TableService<VariantModel> {

    private path = 'samples/variants';

    sampleIdSubject: BehaviorSubject<number>
    sampleId$: Observable<number>

    get sampleId() {
        return this.sampleIdSubject.value
    }

    set sampleId(value: number) {
        this.sampleIdSubject.next(value)
    }

    constructor(apiService: ApiService) {
        super('samples/variants/', apiService, DEFAULT_STATE)

        this.sampleIdSubject = new BehaviorSubject<number>(0)
        this.sampleId$ = this.sampleIdSubject.asObservable();

        this.sampleId$.subscribe((value: number) => {
            this.endpoint = `${this.path}/${value}`;
        })

    }

    
}
