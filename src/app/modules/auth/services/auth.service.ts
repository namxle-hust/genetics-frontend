import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from 'src/app/core/models';
import { AuthModel, IUserRegistration } from '../../../core/models/auth.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';

export type UserType = UserModel | undefined;

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnDestroy {
    // private fields
    private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    private apiPath: string = 'auth';

    // public fields
    currentUser$: Observable<UserType>;
    isLoading$: Observable<boolean>;
    currentUserSubject: BehaviorSubject<UserType>;
    isLoadingSubject: BehaviorSubject<boolean>;

    get currentUserValue(): UserType {
        return this.currentUserSubject.value;
    }

    set currentUserValue(user: UserType) {
        this.currentUserSubject.next(user);
    }

    constructor(
        private router: Router,
        @Inject(ApiService) private apiService: ApiService,
        @Inject(LocalStorageService) private localstorageService: LocalStorageService
    ) {
        this.isLoadingSubject = new BehaviorSubject<boolean>(false);
        this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
        this.currentUser$ = this.currentUserSubject.asObservable();
        this.isLoading$ = this.isLoadingSubject.asObservable();
    }

    // public methods
    login(email: string, password: string): Observable<UserType> {
        this.isLoadingSubject.next(true);

        let path = `${this.apiPath}/signin`;

        return this.apiService.post(path, {
            email: email,
            password: password
        }).pipe(
            map((auth: AuthModel) => {
                const result = this.localstorageService.setAuthFromLocalStorage(auth);
                return result;
            }),
            switchMap(() => this.getUserByToken()),
            catchError((err) => {
                console.error('err', err);
                return of(undefined);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    logout() {
        localStorage.removeItem(this.localstorageService.authLocalStorageTokenName);
        this.router.navigate(['/auth/login'], {
            queryParams: {},
        });
    }

    getUserByToken(): Observable<UserType> {
        this.isLoadingSubject.next(true);

        let path = `${this.apiPath}/me`

        return this.apiService.get(path).pipe(
            map((user: UserType) => {
                if (user) {
                    this.currentUserSubject.next(user);
                } else {
                    this.logout();
                }
                return user;
            }),
            catchError((error) => {
                this.logout();
                return of(undefined)
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    // need create new user then login
    registration(user: IUserRegistration): Observable<any> {
        this.isLoadingSubject.next(true);

        let path = `${this.apiPath}/signup`

        return this.apiService.post(path, user).pipe(
            map(() => {
                this.isLoadingSubject.next(false);
            }),
            switchMap(() => this.login(user.email, user.password)),
            catchError((err) => {
                console.error('err', err);
                return of(undefined);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    forgotPassword(email: string): Observable<boolean> {
        this.isLoadingSubject.next(true);

        let path = `${this.apiPath}/forgot-password`;

        return this.apiService.post(path, { email })
            .pipe(finalize(() => this.isLoadingSubject.next(false)));
    }


    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
}
