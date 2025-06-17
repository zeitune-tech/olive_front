import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin, switchMap, map } from 'rxjs';
import { UserService } from '@core/services/auth/user/user.service';
import { NavigationService } from '@core/navigation/navigation.service';
import { ManagementEntityService } from '@core/services/administration/management-entity/management-entity.service';
import { BranchService } from '@core/services/settings/branch/branch.service';
import { ProductService } from '@core/services/settings/product/product.service';
import { CoverageReferenceService } from '@core/services/settings/coverage-reference/coverage-reference.service';
import { PointOfSaleService } from '@core/services/administration/point-of-sale/point-of-sale.service';
import { ContributorService } from '@core/services/administration/contributor/contributor.service';

@Injectable({
    providedIn: 'root'
})
export class InitialDataResolver implements Resolve<any> {
    constructor(
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _coverageReferenceService: CoverageReferenceService,
        private _managementService: ManagementEntityService,
        private _productService: ProductService,
        private _branchService: BranchService,
        private _pointOfSaleService: PointOfSaleService,
        private _contributorService: ContributorService
    ) {}

    resolve(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): Observable<any> {
        
        return forkJoin([
            this._userService.get(),
            this._coverageReferenceService.getAll(),
            this._managementService.get(),
            this._productService.getAll(),
            this._branchService.getAll(),
            this._pointOfSaleService.getAll(),
            this._contributorService.getAll()
        ])
    }
}
