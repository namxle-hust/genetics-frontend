import { Injectable } from "@angular/core";
import {
    HttpHeaders
} from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthModel } from "../models";


@Injectable({
    providedIn: "root",
})
export class LocalStorageService {
    private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;


    get authLocalStorageTokenName(): string {
        return this.authLocalStorageToken
    }

    public getAuthFromLocalStorage(): AuthModel | undefined {
        try {
            const lsValue = localStorage.getItem(this.authLocalStorageToken);
            if (!lsValue) {
                return undefined;
            }

            const authData = JSON.parse(lsValue);
            return authData;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    // private methods
    public setAuthFromLocalStorage(auth: AuthModel): boolean {
        // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
        if (auth && auth.access_token) {
            localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
            return true;
        }
        return false;
    }
}