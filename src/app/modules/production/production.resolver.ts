import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { PermissionsService } from '@core/permissions/permissions.service';
import { InsuredService } from '@core/services/insured/insured/insured.service';
import { VehicleService } from '@core/services/insured/vehicle/vehicle.service';
import { InsuredRegistryService } from '@core/services/settings/insured-registry/insured-registry.service';
import { CoverageService } from '@core/services/settings/coverage/coverage.service';
import { BaseTaxService } from '@core/services/settings/base-tax/base-tax.service';
import { TaxRegimeService } from '@core/services/settings/tax-regime/tax-regime.service';
import { AccessoryService } from '@core/services/settings/accessory/accessory.service';
import { PointOfSaleService } from '@core/services/administration/point-of-sale/point-of-sale.service';
import { DurationRateService } from '@core/services/settings/duration-rate/duration-rate.service';
import { ProductionRegistryService } from '@core/services/settings/production-registry/production-registry.service';

@Injectable({
    providedIn: 'root'
})
export class ProductionResolver implements Resolve<any> {

    /**
     * Constructor
     */
    constructor(
        private _permissionService: PermissionsService,
        private _insuredRegistryService: InsuredRegistryService,
        private _productionRegistryService: ProductionRegistryService,
        private _insuredService: InsuredService,
        private _vehicleService: VehicleService,
        private _coverageService: CoverageService,
        private _baseTaxService: BaseTaxService,
        private _regimeService: TaxRegimeService,
        private _accessoireService: AccessoryService,
        private _pointsOfSaleService: PointOfSaleService,
        private _durationRateService: DurationRateService
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


        // // if (this._permissionService.hasPermission('VIEW_INSUREDS')) {
        //     resolList.push(this._insuredService.getAll());
        // // }

        // // if (this._permissionService.hasPermission('VIEW_VEHICLES')) {
        //     resolList.push(this._vehicleService.getAll());
        // // }

        // // if (this._permissionService.hasPermission('VIEW_INSURED_REGISTRY')) {
        //     resolList.push(this._insuredRegistryService.getAll());
        // // }

        // // if (this._permissionService.hasPermission('VIEW_PRODUCTION_REGISTRIES')) {
        //     resolList.push(this._productionRegistryService.getAll());
        // // }

        // // if (this._permissionService.hasPermission('VIEW_COVERAGES')) {
        //     resolList.push(this._coverageService.getAll());
        // // }

        // // if (this._permissionService.hasPermission('VIEW_BASE_TAXES')) {
        //     resolList.push(this._baseTaxService.getAll());
        // // }

        // // if (this._permissionService.hasPermission('VIEW_TAX_REGIMES')) {
        //     resolList.push(this._regimeService.getAll());
        // // }

        // // if (this._permissionService.hasPermission('VIEW_ACCESSORIES')) {
        //     resolList.push(this._accessoireService.getAll());
        // // }

        // // if (this._permissionService.hasPermission('VIEW_POINTS_OF_SALE')) {
        //     resolList.push(this._pointsOfSaleService.getAll());
        // // }

        // // if (this._permissionService.hasPermission('VIEW_DURATION_RATES')) {
        //     resolList.push(this._durationRateService.getAll());
        // // }



        // Return the forkJoin of all observables
        if (resolList.length === 0) {
            return of({});
        }

        return forkJoin(resolList);
    }
}
