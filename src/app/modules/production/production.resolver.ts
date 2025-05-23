import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { PermissionsService } from '@core/permissions/permissions.service';
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


        return forkJoin(resolList);
    }
}
