import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class InsuredsResolver implements Resolve<any> { 

    constructor(
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return forkJoin([
            new Observable((observer) => {
                observer.next({
                    data: {
                        title: 'Insureds'
                    }
                });
                observer.complete();
            })
        ])
    }
}