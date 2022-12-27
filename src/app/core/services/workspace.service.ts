// tslint:disable:variable-name
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { TableService } from 'src/app/shared/crud-table/services/table.service';

import { WorkspaceModel } from '../models/workspace.model';
import { ApiService } from './api.service';

@Injectable()

export class WorkspaceService extends TableService<WorkspaceModel> {

    constructor(apiService: ApiService) {
        super('workspace', apiService);
    }

    getWorkspaces(): Observable<WorkspaceModel[]> {
        let path = `${this.endpoint}/all`
        return this.apiService.get(path).pipe(
            catchError(err => {
                console.error('FIND ALL WORKSPCES', err);
                return of([]);
            })
        );
    }
}
