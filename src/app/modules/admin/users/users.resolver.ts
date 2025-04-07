import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { UserService } from '@core/services/auth/user/user.service';
import { forkJoin, map, Observable, of } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class UsersResolver implements Resolve<any> { 

    constructor(
        private _employeeService: UserService
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return forkJoin([
            of(null)
        ])
    }
}