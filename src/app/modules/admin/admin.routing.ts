import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { CompaniesResolver } from "./companies/companies.resolver";
import { PointsOfSaleResolver } from "./points-of-sale/points-of-sale.resolver";
import { UsersResolver } from "./users/users.resolver";

export const routes: Routes = [
        {
            path: 'products',
            canActivate: [],
            canActivateChild: [],
            data: {
                permission: PERMISSIONS.VIEW_PRODUCTS
            },
            loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
        },
        {
            path: 'market-level-organization',
            canActivate: [],
            canActivateChild: [],
            data: {
                permission: PERMISSIONS.VIEW_ALL_MARKET_LEVEL_ORGANIZATION
            },
            loadChildren: () => import('./market-level-organization/market-level-organization.module').then(m => m.MarketLevelOrganizationModule)
        },
        {
            path: 'companies',
            canActivate: [],
            canActivateChild: [],
            data: {
                permission: PERMISSIONS.VIEW_ALL_COMPANIES
            },
            resolve: {
                // CompaniesResolver
            },
            loadChildren: () => import('./companies/companies.module').then(m => m.CompaniesModule)
        },
        {
            path: 'points-of-sale',
            canActivate: [],
            canActivateChild: [],
            data: {
                permission: PERMISSIONS.VIEW_COMPANY_POINTS_OF_SALE
            },
            loadChildren: () => import('./points-of-sale/points-of-sale.module').then(m => m.PointsOfSaleModule)
        },
        {
            path: 'company-level-organization',
            canActivate: [],
            canActivateChild: [],
            data: {
                permission: PERMISSIONS.VIEW_ALL_COMPANY_LEVEL_ORGANIZATION
            },
            loadChildren: () => import('./company-level-organization/company-level-organization.module').then(m => m.CompanyLevelOrganizationModule)
        },
        {
            path: 'profiles',
            canActivate: [],
            canActivateChild: [],
            data: {
                permission: PERMISSIONS.VIEW_PROFILES
            },
            loadChildren: () => import('./profiles/profiles.module').then(m => m.ProfilesModule)
        },
        {
            path: 'users',
            canActivate: [],
            canActivateChild: [],
            data: {
                permission: PERMISSIONS.VIEW_USERS
            },
            resolve: {
                data: UsersResolver
            },
            loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
        },
];