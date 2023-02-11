// tslint:disable:variable-name
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { TableService } from 'src/app/shared/crud-table/services/table.service';
import { IAnalysisQCUrl, AnalysisModel } from '../models';
import { ApiService } from './api.service';

@Injectable()

export class AnalysisService extends TableService<AnalysisModel> {

    constructor(apiService: ApiService) {
        super('analysis', apiService);

    }

    getQCUrl(id: number): Observable<IAnalysisQCUrl> {
        const path = `${this.endpoint}/${id}/qc-url`
        return this.apiService.get(path).pipe(catchError(error => {
            console.log(error);
            return of()
        }))
    }

    getIgvUrls(analysisId: number) {
        const path = `${this.endpoint}/${analysisId}/igv-url`
        return this.apiService.get(path).pipe(catchError(error => {
            console.log(error);
            return of()
        }))
    }
}
