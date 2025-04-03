import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
import { NavigationService } from '@core/navigation/navigation.service';
import { MarketLevelOrganizationService } from '@core/services/market-level-organization/market-level-organization.service';
import { PointOfSaleService } from '@core/services/point-of-sale/point-of-sale.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { ProductService } from '@core/services/product/product.service';
import { CompanyLevelOrganizationService } from '@core/services/company-level-organization/company-level-organization.service';
import { CompanyService } from '@core/services/company/company.service';
import { RestrictionService } from '@core/services/restriction/restriction.service';

@Injectable({
    providedIn: 'root'
})
export class InitialDataResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
        private _navigationService: NavigationService,
        private _marketLevelOrganizationService: MarketLevelOrganizationService,
        private _pointOfSaleService: PointOfSaleService,
        private _companyLevelOrganizationService: CompanyLevelOrganizationService,
        private _companyService: CompanyService,
        private _profileService: ProfileService,
        private _productService: ProductService,
        private _restrictionService: RestrictionService,
    ) { }

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


        return forkJoin([
            this._navigationService.get(),
            this._userService.get(),
            this._userService.getAll(),
            this._marketLevelOrganizationService.getAll(),
            this._pointOfSaleService.getAll(),
            this._profileService.getAll(),
            this._profileService.getAllPermissions(),
            this._productService.getAll(),
            this._pointOfSaleService.getBrokers(),
            this._companyLevelOrganizationService.getAll(),
            this._companyService.getAll(),
            this._restrictionService.getAll(),
        ])
    }

    
}
