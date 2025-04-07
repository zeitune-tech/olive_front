import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CompanyLevelOrganizationService } from '@core/services/administration/company-level-organization/company-level-organization.service';
import { PointOfSaleService } from '@core/services/administration/point-of-sale/point-of-sale.service';
import { forkJoin, map, Observable, of } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class PointsOfSaleResolver implements Resolve<any> { 

    constructor(
        private _companyLevelOrganizationService: CompanyLevelOrganizationService,
        private _pointOfSaleService: PointOfSaleService
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return forkJoin([
            this._companyLevelOrganizationService.getAll(),
        ])
    }
}