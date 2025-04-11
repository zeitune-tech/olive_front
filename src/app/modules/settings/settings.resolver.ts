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

@Injectable({
    providedIn: 'root'
})
export class SettingsResolver implements Resolve<any> {

    /**
     * Constructor
     */
    constructor(
        private _permissionService: PermissionsService,
        private _coverageService: CoverageService,
        private _incompatibleCoverageService: IncompatibleCoverageService,
        private _productionRegistryService: ProductionRegistryService,
        private _insuredRegistryService: InsuredRegistryService,
        private _coverageDurationService: CoverageDurationService
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

        if (this._permissionService.hasPermission(PERMISSIONS.VIEW_COVERAGES)) {
            resolList.push(this._coverageService.getAll());
            resolList.push(this._incompatibleCoverageService.getAll());
        }

        if (this._permissionService.hasPermission(PERMISSIONS.VIEW_PRODUCTION_REGISTRIES)) {
            resolList.push(this._productionRegistryService.getAll());
        }

        if (this._permissionService.hasPermission(PERMISSIONS.VIEW_INSURED_REGISTRIES)) {
            resolList.push(this._insuredRegistryService.getAll());
        }

        if (this._permissionService.hasPermission(PERMISSIONS.VIEW_COVERAGE_DURATIONS)) {
            resolList.push(this._coverageDurationService.getAll());
        }
       
        return forkJoin(resolList);
    }
}
