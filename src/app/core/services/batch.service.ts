// tslint:disable:variable-name
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { TableService } from 'src/app/shared/crud-table/services/table.service';
import { BatchModel } from '../models';
import { ApiService } from './api.service';

@Injectable()

export class BatchService extends TableService<BatchModel> {

    constructor(apiService: ApiService) {
        super('batch', apiService);

    }

    getBatches(): Observable<BatchModel[]> {
        let path = `${this.endpoint}/all`
        return this.apiService.get(path).pipe(
            catchError(err => {
                console.error('FIND ALL BATCHES', err);
                return of([]);
            })
        );
    }
}
