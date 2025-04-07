import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { UserService } from '@core/services/auth/user/user.service';
import { PermissionsService } from '@core/permissions/permissions.service';
import { PERMISSIONS } from '@core/permissions/permissions.data';

@Injectable({
    providedIn: 'root'
})
export class SettingsResolver implements Resolve<any> {

    private _managementEntity: string = '';

    /**
     * Constructor
     */
    constructor(
        private _permissionService: PermissionsService,
        private _userService: UserService,
    ) {
        this._userService.user$.subscribe((user) => {
            if (user) {
                this._managementEntity = user.managementEntity;
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Use this resolver to resolve initial mock-api for the application
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): Observable<any> {
        // Fork join multiple API endpoint calls to wait all of them to finish

        const resolList: Observable<any>[] = [
            of()
        ];
       
        return of([])
    }
}
