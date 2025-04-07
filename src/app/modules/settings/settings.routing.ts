import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const routes: Routes = [
    {
        path: 'coverages',
        canActivate: [],
        canActivateChild: [],
        data: {
            permission: PERMISSIONS.VIEW_PRODUCTS
        },
        loadChildren: () => import('./coverages/coverages.module').then(m => m.CoveragesModule)
    },
    {
        path: 'coverage-durations',
        canActivate: [],
        canActivateChild: [],
        data: {
            permission: PERMISSIONS.VIEW_COVERAGE_DURATIONS
        },
        loadChildren: () => import('./coverage-durations/coverage-durations.module').then(m => m.CoverageDurationsModule)
    },
    {
        path: 'production-registries',
        canActivate: [],
        canActivateChild: [],
        data: {
            permission: PERMISSIONS.VIEW_PRODUCTION_REGISTRIES
        },
        loadChildren: () => import('./production-registries/production-registries.module').then(m => m.ProductionRegistriesModule)
    },
    {
        path: 'insured-registries',
        canActivate: [],
        canActivateChild: [],
        data: {
            permission: PERMISSIONS.VIEW_INSURED_REGISTRIES
        },
        loadChildren: () => import('./insured-registries/insured-registries.module').then(m => m.InsuredRegistriesModule)
    },
    {
        path: 'closures',
        canActivate: [],
        canActivateChild: [],
        data: {
            permission: PERMISSIONS.VIEW_CLOSURES
        },
        loadChildren: () => import('./closures/closures.module').then(m => m.ClosuresModule)
    }
];