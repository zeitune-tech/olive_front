import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { PERMISSIONS } from '@core/permissions/permissions.data';
import { PermissionsService } from '@core/permissions/permissions.service';
import { LotAttestationsService } from '@core/services/attestations/lot-attestation/lot-attestation.service';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AttestationsResolver implements Resolve<any> {

    private _managementEntity: string = '';

    /**
     * Constructor
     */
    constructor(
        private _permissionService: PermissionsService,
        private _lotAttestationService: LotAttestationsService,
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

        let resolList: Observable<any>[] = [of({})];

        if (this._permissionService.hasPermission(PERMISSIONS.VIEW_ATTESTATIONS)) {
            resolList.push(this._lotAttestationService.getAll());
        }
        

        return forkJoin(resolList)
    }
}
