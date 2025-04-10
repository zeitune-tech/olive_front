import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { UserService } from '@core/services/auth/user/user.service';
import { MarketLevelOrganizationService } from '@core/services/administration/market-level-organization/market-level-organization.service';
import { PointOfSaleService } from '@core/services/administration/point-of-sale/point-of-sale.service';
import { ProductService } from '@core/services/administration/product/product.service';
import { CompanyLevelOrganizationService } from '@core/services/administration/company-level-organization/company-level-organization.service';
import { CompanyService } from '@core/services/administration/company/company.service';
import { PermissionsService } from '@core/permissions/permissions.service';
import { PERMISSIONS } from '@core/permissions/permissions.data';
import { ProfileService } from '@core/services/auth/profile/profile.service';

@Injectable({
    providedIn: 'root'
})
export class AdministrationResolver implements Resolve<any> {

    private _managementEntity: string = '';

    /**
     * Constructor
     */
    constructor(
        private _permissionService: PermissionsService,
        private _userService: UserService,
        private _marketLevelOrganizationService: MarketLevelOrganizationService,
        private _pointOfSaleService: PointOfSaleService,
        private _companyLevelOrganizationService: CompanyLevelOrganizationService,
        private _companyService: CompanyService,
        private _profileService: ProfileService,
        private _productService: ProductService
    ) {
        this._userService.user$.subscribe((user) => {
            if (user) {
                this._managementEntity = user.managementEntity;
            }
        });
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

        let resolList: Observable<any>[] = [];
        if (this._permissionService.hasPermission(PERMISSIONS.VIEW_USERS)) {
            resolList.push(this._userService.getUsersByManagementEntity(
                this._managementEntity
            ));
        }
        if (this._permissionService.hasPermission(PERMISSIONS.VIEW_MARKET_LEVEL_ORGANIZATIONS)) {
            resolList.push(this._marketLevelOrganizationService.getAll());
            resolList.push(this._marketLevelOrganizationService.getLinked());
        }
        if (this._permissionService.hasPermission(PERMISSIONS.VIEW_POINTS_OF_SALE)) {
            resolList.push(this._pointOfSaleService.getAll());
        }
        if (this._permissionService.hasPermission(PERMISSIONS.CREATE_USERS)) {
            resolList.push(this._profileService.getAll());
            resolList.push(this._profileService.getAllPermissions());
        }
        if (this._permissionService.hasPermission(PERMISSIONS.VIEW_BROKERS)) {
            resolList.push(this._pointOfSaleService.getBrokers());
        }
        if (this._permissionService.hasPermission(PERMISSIONS.VIEW_COMPANY_LEVEL_ORGANIZATIONS)) {
            resolList.push(this._companyLevelOrganizationService.getAll());
        }
        if (this._permissionService.hasPermission(PERMISSIONS.VIEW_COMPANIES)) {
            resolList.push(this._companyService.getAll());
        }

        return forkJoin(resolList)
    }
}
