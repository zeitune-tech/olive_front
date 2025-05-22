import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { MarketLevelOrganizationService } from '@core/services/administration/market-level-organization/market-level-organization.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class EntitiesSuperiorResolver implements Resolve<any> { 

    constructor(
        private _marketLevelService: MarketLevelOrganizationService
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return forkJoin([
            this._marketLevelService.getLinked(),
            this._marketLevelService.getAll()
        ])
    }
}