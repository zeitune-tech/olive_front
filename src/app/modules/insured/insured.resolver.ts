import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { UserService } from '@core/services/auth/user/user.service';
import { PermissionsService } from '@core/permissions/permissions.service';
import { PERMISSIONS } from '@core/permissions/permissions.data';
import { CoverageService } from '@core/services/settings/coverage/coverage.service';
import { CoverageReferenceService } from '@core/services/settings/coverage-reference/coverage-reference.service';
import { InsuredRegistryService } from '@core/services/settings/insured-registry/insured-registry.service';
import { ProductionRegistryService } from '@core/services/settings/production-registry/production-registry.service';
import { IncompatibleCoverageService } from '@core/services/settings/incompatible-coverage/incompatible-coverage.service';
import { CoverageDuration } from '@core/services/settings/coverage-duration/coverage-duration.interface';
import { CoverageDurationService } from '@core/services/settings/coverage-duration/coverage-duration.service';
import { AccessoryService } from '@core/services/settings/accessory/accessory.service';
import { BaseTaxService } from '@core/services/settings/base-tax/base-tax.service';
import { TaxService } from '@core/services/settings/tax/tax.service';
import { TaxRegimeService } from '@core/services/settings/tax-regime/tax-regime.service';
import { CommissionService } from '@core/services/settings/commission/commission.service';
import { CommissionContributorService } from './../../core/services/settings/commission-contributor/commission-contributor.service';
import { InsuredService } from '@core/services/insured/insured/insured.service';
import { VehicleService } from '@core/services/insured/vehicle/vehicle.service';

@Injectable({
    providedIn: 'root'
})
export class InsuredResolver implements Resolve<any> {

    /**
     * Constructor
     */
    constructor(
        private _permissionService: PermissionsService,
        private _insuredService: InsuredService,
        private _vehicleService: VehicleService
    ) {
     
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

        const resolList: Observable<any>[] = [];

        // Insured
        resolList.push(this._insuredService.getAll());
        // Vehicle
        resolList.push(this._vehicleService.getAll());

        return forkJoin(resolList);
    }
}
