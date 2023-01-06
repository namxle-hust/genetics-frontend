import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiService } from '../services';

@Injectable({
    providedIn: 'root'
})
export class SamplesGuard implements CanActivate {
    private path = 'samples'

    constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        console.log(route);

        return this.apiService.get(`${this.path}/${route.params["id"]}/detail`)
            .pipe(
                map(data => {
                    return !!data
                }),
                catchError((error) => {
                    if (error.error && error.error.message) {
                        this.toastr.error(error.error.message);
                    } else {
                        this.toastr.error("Unknown Error");
                    }
                    this.router.navigate(['/errors/404']);
                    return of(false)
                })
            )

    }

}
