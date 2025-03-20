import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AttestationService } from '@core/services/attestation/attestation.service';
import { CompanyService } from '@core/services/company/company.service';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class AttestationsResolver implements Resolve<any> { 

    constructor(
        private _attestationService: AttestationService,
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return forkJoin([
            this._attestationService.getAttestations(),
            this._attestationService.getMyAttestations()
        ])
    }
}