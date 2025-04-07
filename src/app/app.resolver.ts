import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin, switchMap, map } from 'rxjs';
import { UserService } from '@core/services/auth/user/user.service';
import { NavigationService } from '@core/navigation/navigation.service';
import { ManagementEntityService } from '@core/services/administration/management-entity/management-entity.service';

@Injectable({
    providedIn: 'root'
})
export class InitialDataResolver implements Resolve<any> {
    constructor(
        private _userService: UserService,
        private _navigationService: NavigationService,
        private _managementService: ManagementEntityService,
    ) {}

    resolve(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): Observable<any> {
        return this._userService.get().pipe(
            switchMap(user => {
                const managementEntityId = user?.managementEntity;

                return forkJoin({
                    navigation: this._navigationService.get(),
                    managementEntity: this._managementService.get(managementEntityId),
                }).pipe(
                    map(({ navigation, managementEntity }) => ({
                        user,
                        navigation,
                        managementEntity
                    }))
                );
            })
        );
    }
}
