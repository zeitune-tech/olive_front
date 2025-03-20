import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { EntitySuperiorService } from '@core/services/entity-superior/entity-superior.service';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class EntitiesSuperiorResolver implements Resolve<any> { 

    constructor(
        private _entitySuperiorService: EntitySuperiorService
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return forkJoin([
            this._entitySuperiorService.getEntitiesSuperiorLinked(),
            this._entitySuperiorService.getEntitiesSuperior()
        ])
    }
}