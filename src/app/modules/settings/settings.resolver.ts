import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { PermissionsService } from '@core/permissions/permissions.service';
import { PERMISSIONS } from '@core/permissions/permissions.data';
import { CoverageService } from '@core/services/settings/coverage/coverage.service';
import { CoverageReferenceService } from '@core/services/settings/coverage-reference/coverage-reference.service';
import { InsuredRegistryService } from '@core/services/settings/insured-registry/insured-registry.service';
import { ProductionRegistryService } from '@core/services/settings/production-registry/production-registry.service';
import { IncompatibleCoverageService } from '@core/services/settings/incompatible-coverage/incompatible-coverage.service';
import { CoverageDurationService } from '@core/services/settings/coverage-duration/coverage-duration.service';
import { AccessoryService } from '@core/services/settings/accessory/accessory.service';
import { BaseTaxService } from '@core/services/settings/base-tax/base-tax.service';
import { TaxService } from '@core/services/settings/tax/tax.service';
import { TaxRegimeService } from '@core/services/settings/tax-regime/tax-regime.service';
import { CommissionService } from '@core/services/settings/commission/commission.service';
import { CommissionContributorService } from './../../core/services/settings/commission-contributor/commission-contributor.service';
import { CommissionTaxService } from '@core/services/settings/commission-tax/commission-tax.service';
import { DurationRateService } from '@core/services/settings/duration-rate/duration-rate.service';

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
        private _coverageReferenceService: CoverageReferenceService,
        private _incompatibleCoverageService: IncompatibleCoverageService,
        private _productionRegistryService: ProductionRegistryService,
        private _insuredRegistryService: InsuredRegistryService,
        private _coverageDurationService: CoverageDurationService,
        private _accessoryService: AccessoryService,
        private _baseTaxService: BaseTaxService,
        private _taxService: TaxService,
        private _taxRegimeService: TaxRegimeService,
        private _commissionService: CommissionService,
        private _commissionContributorService: CommissionContributorService,
        private _commissionTaxService: CommissionTaxService,
        private _durationRateService: DurationRateService,
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
            resolList.push(this._coverageReferenceService.getAll());
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

        // if (this._permissionService.hasPermission(PERMISSIONS.VIEW_ACCESSORIES)) {
            resolList.push(this._accessoryService.getAll());
        // }

        // if (this._permissionService.hasPermission(PERMISSIONS.VIEW_BASE_TAXES)) {
            resolList.push(this._baseTaxService.getAll());
        // }

        // if (this._permissionService.hasPermission(PERMISSIONS.VIEW_TAXES)) {
            resolList.push(this._taxService.getAll());
        // }

        // if (this._permissionService.hasPermission(PERMISSIONS.VIEW_TAX_REGIMES)) {
            resolList.push(this._taxRegimeService.getAll());
        // }

        // if (this._permissionService.hasPermission(PERMISSIONS.VIEW_COMMISSION)) {
            resolList.push(this._commissionService.getAll());
        // }

        // if (this._permissionService.hasPermission(PERMISSIONS.VIEW_COMMISSION_CONTRIBUTORS)) {
            resolList.push(this._commissionContributorService.getAll());
        // }

        // if (this._permissionService.hasPermission(PERMISSIONS.VIEW_USERS)) {
            resolList.push(this._commissionTaxService.getAll());
        //}

        // if (this._permissionService.hasPermission(PERMISSIONS.VIEW_DURATION_RATES)) {
            resolList.push(this._durationRateService.getAll());
        // }
        
        return forkJoin(resolList);
    }
}
