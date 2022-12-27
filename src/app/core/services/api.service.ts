import { Injectable } from "@angular/core";
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
    HttpHeaderResponse,
} from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError, map, tap, timeout } from "rxjs/operators";
import { Observable, throwError, TimeoutError } from "rxjs";
import { AuthModel } from "../models";
import { LocalStorageService } from "./localstorage.service";


@Injectable({
    providedIn: "root",
})
export class ApiService {
    private apiUrl = environment.apiUrl;
    private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

    constructor(private http: HttpClient, private localstorageService: LocalStorageService) {
    }

    public get<T>(path: string, params?: object) {
        let url = `${this.apiUrl}/${path}`;
        let options = {
            headers: this.headerOptions,
            ...params,
        };

        return this.http.get<T>(url, options).pipe(
            timeout(10000),
            map((res: any) => {
                return res;
            }),
            catchError((error) => {
                if (error instanceof TimeoutError) {
                    return throwError("Request Timeout. Please try again later!");
                }
                return throwError(error);
            })
        );
    }

    public post<T>(
        path: string,
        params?: object | T,
        httpOptions?: object,
    ) {
        let url = `${this.apiUrl}/${path}`;
        let options = {
            headers: this.headerOptions,
            ...httpOptions,
        };
        let paramsRq = { ...params };

        return this.http.post<T>(url, paramsRq, options).pipe(
            timeout(10000),
            map((res: any) => {
                return res;
            }),
            catchError((err) => {
                if (err instanceof TimeoutError) {
                    return throwError("Request Timeout. Please try again later!");
                }
                return throwError(err);
            })
        );
    }

    public delete<T>(
        path: string,
        httpOptions?: object
    ) {
        let url = `${this.apiUrl}/${path}`;
        let options = {
            headers: this.headerOptions,
            ...httpOptions,
        };

        return this.http.delete<T>(url, options).pipe(
            timeout(10000),
            map((res: any) => {
                return res;
            }),
            catchError((err) => {
                if (err instanceof TimeoutError) {
                    return throwError("Request Timeout. Please try again later!");
                }
                return throwError(err);
            })
        );
    }

    get headerOptions (): HttpHeaders {
        let authData = this.localstorageService.getAuthFromLocalStorage();

        if (authData && authData.access_token) {
            return new HttpHeaders({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authData.access_token}`
            });
        }

        return new HttpHeaders({
            "Content-Type": "application/json",
        })
    }
}