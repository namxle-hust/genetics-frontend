import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Observable, of } from "rxjs";
import { IReportData } from "../models";
import { ApiService } from "./api.service";

@Injectable()
export class ReportService {
    private endpoint: string

   

    constructor(
        private apiService: ApiService
    ) {
        this.endpoint = 'report';
    }

    getReportData(id: number): Observable<IReportData> {
        const path = `${this.endpoint}/${id}/data`
        return this.apiService.get(path).pipe(catchError(error => {
            console.log(error);
            return of()
        }))
    }

}