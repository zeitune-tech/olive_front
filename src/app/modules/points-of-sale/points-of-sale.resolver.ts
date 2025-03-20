import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { PointOfSaleService } from '@core/services/point-of-sale/point-of-sale.service';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class PointsOfSaleResolver implements Resolve<any> { 

    constructor(
        private _pointOfSaleService: PointOfSaleService
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return forkJoin([
            this._pointOfSaleService.getAllLinked(),
            this._pointOfSaleService.getAllUnlinked()
        ])
    }
}