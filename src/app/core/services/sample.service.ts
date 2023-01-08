// tslint:disable:variable-name
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { TableService } from 'src/app/shared/crud-table/services/table.service';
import { SampleModel } from '../models';
import { ApiService } from './api.service';

@Injectable()

export class SampleService extends TableService<SampleModel> {

    constructor(apiService: ApiService) {
        super('samples', apiService);

    }

    getSamples(): Observable<SampleModel[]> {
        let path = `${this.endpoint}/all`
        return this.apiService.get(path).pipe(
            catchError(err => {
                console.error('FIND ALL SAMPLES', err);
                return of([]);
            })
        );
    }
}
