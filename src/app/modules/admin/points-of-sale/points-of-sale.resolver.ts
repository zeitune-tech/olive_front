import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, map, Observable, of } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class PointsOfSaleResolver implements Resolve<any> { 

    constructor() { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return forkJoin([
            of(null)
        ])
    }
}