import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const routes: Routes = [
    { 
        path: 'stock',
        canActivate: [],
        canActivateChild: [],
        data: {
            permission: PERMISSIONS.VIEW_ATTESTATIONS
        },
        loadChildren: () => import('./stock/stock.module').then(m => m.StockModule)
    },
    {
        path: 'demands',
        canActivate: [],
        canActivateChild: [],
        data: {
            permission: PERMISSIONS.VIEW_ATTESTATIONS_DEMANDS
        },
        loadChildren: () => import('./demands/demands.module').then(m => m.DemandsModule)
    },
    {
        path: 'companies',
        canActivate: [],
        canActivateChild: [],
        data: {
            permission: PERMISSIONS.DELIVER_ATTESTATIONS_TO_COMPANY,

        },
        loadChildren: () => import('./companies/companies-attestations.module').then(m => m.CompaniesAttestationsModule)
    },
    {
        path: 'points-of-sale',
        canActivate: [],
        canActivateChild: [],
        data: {
            permission: PERMISSIONS.DELIVER_ATTESTATIONS_TO_POINTS_OF_SALE,
        },
        loadChildren: () => import('./points-of-sale/points-of-sale-attestations.module').then(m => m.PointsOfSaleAttestationsModule)
    }
]