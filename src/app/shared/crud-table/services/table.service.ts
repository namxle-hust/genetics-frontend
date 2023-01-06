// tslint:disable:variable-name
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { PaginatorState } from '../models/paginator.model';
import { ITableState, TableResponseModel } from '../models/table.model';
import { BaseModel } from '../models/base.model';
import { SortState } from '../models/sort.model';
import { GroupingIdType, GroupingState } from '../models/grouping.model';
import { ApiService } from 'src/app/core/services/api.service';

const DEFAULT_STATE: ITableState = {
    filter: {},
    paginator: new PaginatorState(),
    sorting: new SortState(),
    searchTerm: '',
    grouping: new GroupingState(),
    entityId: undefined
};

export abstract class TableService<T> {
    // Private fields
    private _items$ = new BehaviorSubject<T[]>([]);
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
    private _tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
    private _errorMessage = new BehaviorSubject<string>('');
    private _subscriptions: Subscription[] = [];

    // Getters
    get items$() {
        return this._items$.asObservable();
    }
    get isLoading$() {
        return this._isLoading$.asObservable();
    }
    get isFirstLoading$() {
        return this._isFirstLoading$.asObservable();
    }
    get errorMessage$() {
        return this._errorMessage.asObservable();
    }
    get subscriptions() {
        return this._subscriptions;
    }
    // State getters
    get paginator() {
        return this._tableState$.value.paginator;
    }
    get filter() {
        return this._tableState$.value.filter;
    }
    get sorting() {
        return this._tableState$.value.sorting;
    }
    get searchTerm() {
        return this._tableState$.value.searchTerm;
    }
    get grouping() {
        return this._tableState$.value.grouping;
    }
    protected endpoint: string;

    constructor(endpoint: string, protected apiService: ApiService, tableState?: ITableState) {
        if (tableState) {
            this._tableState$ = new BehaviorSubject<ITableState>(tableState);
        }
        this.endpoint = endpoint
        this.endpoint = `${endpoint}`
    }

    // CREATE
    // server should return the object with ID
    create(item: T): Observable<T> {
        const path = this.endpoint + '/create'
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.apiService.post<T>(path, item).pipe(
            catchError(err => {
                if (err && err.error && err.error.message) {
                    this._errorMessage.next(err.error.message);
                } else {
                    this._errorMessage.next('Unknown Error')
                }
                console.error('CREATE ITEM', err);
                return of (undefined)
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    // READ (Returning filtered list of entities)
    find(tableState: ITableState): Observable<TableResponseModel<T>> {
        const path = this.endpoint + '/find';
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.apiService.post<TableResponseModel<T>>(path, tableState).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.error('FIND ITEMS', err);
                return of({ items: [], total: 0 });
            })
        );
    }

    getItemById(id: GroupingIdType): Observable<T> {
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const path = `${this.endpoint}/${id}`;
        return this.apiService.get<T>(path).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.error('GET ITEM BY ID', id, err);
                throw err;
            }),
            finalize(() => { 
                this._isLoading$.next(false) 
            })
        );
    }

    // UPDATE
    update(item: BaseModel): Observable<T> {
        const path = `${this.endpoint}/update/${item.id}`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.apiService.post(path, item).pipe(
            catchError(err => {
                if (err && err.error && err.error.message) {
                    this._errorMessage.next(err.error.message);
                } else {
                    this._errorMessage.next('Unknown Error')
                }
                console.error('UPDATE ITEM', item, err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    // UPDATE Status
    updateStatusForItems(ids: GroupingIdType[], status: number): Observable<any> {
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const body = { ids, status };
        const path = this.endpoint + '/updateStatus';
        return this.apiService.post(path, body).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.error('UPDATE STATUS FOR SELECTED ITEMS', ids, status, err);
                return of([]);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    // DELETE
    delete(id: any): Observable<any> {
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const path = `${this.endpoint}/${id}`;
        return this.apiService.delete(path).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.error('DELETE ITEM', id, err);
                return of({});
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    // delete list of items
    deleteItems(ids: GroupingIdType[] = []): Observable<any> {
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const path = this.endpoint + '/deleteItems';
        const body = { ids };
        return this.apiService.post(path, body).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.error('DELETE SELECTED ITEMS', ids, err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    public fetch() {
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const request = this.find(this._tableState$.value)
            .pipe(
                tap((res: TableResponseModel<T>) => {
                    this._items$.next(res.items);
                    this.patchStateWithoutFetch({
                        paginator: this._tableState$.value.paginator.recalculatePaginator(
                            res.total
                        ),
                    });
                }),
                catchError((err) => {
                    this._errorMessage.next(err);
                    return of({
                        items: [],
                        total: 0
                    });
                }),
                finalize(() => {
                    this._isLoading$.next(false);
                    const itemIds = this._items$.value.map((el: T) => {
                        const item = (el as unknown) as BaseModel;
                        return item.id;
                    });
                    this.patchStateWithoutFetch({
                        grouping: this._tableState$.value.grouping.clearRows(itemIds),
                    });
                })
            )
            .subscribe();
        this._subscriptions.push(request);
    }

    // Base Methods
    public patchState(patch: Partial<ITableState>) {
        this.patchStateWithoutFetch(patch);
        this.fetch();
    }

    public patchStateReset() {
        let patchReset = {
            filter: {},
            paginator: new PaginatorState(),
            sorting: new SortState(),
            searchTerm: '',
            grouping: new GroupingState(),
            entityId: undefined
        };
        this.patchStateWithoutFetch(patchReset);
    }

    public patchStateWithoutFetch(patch: Partial<ITableState>) {
        const newState = Object.assign(this._tableState$.value, patch);
        this._tableState$.next(newState);
    }
}
