import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const routes: Routes = [
    {
        path: 'formula',
        canActivate: [],
        canActivateChild: [],
        data: {
            // permission: PERMISSIONS.VIEW_PRICING_FORMULA
        },
        loadChildren: () => import('./formula/formula.module').then(m => m.FormulaModule)
    },
    {
        path: 'constants',
        canActivate: [],
        canActivateChild: [],
        data: {
            // permission: PERMISSIONS.VIEW_PRICING_CONSTANTS
        },
        loadChildren: () => import('./constants/constants.module').then(m => m.ConstantsModule)
    },
    {
        path: 'caracteristics',
        canActivate: [],
        canActivateChild: [],
        data: {
            // permission: PERMISSIONS.VIEW_PRICING_CARACTERISTICS
        },
        loadChildren: () => import('./caracteristics/caracteristics.module').then(m => m.CaracteristicsModule)
    },
    {
        path: 'conditions',
        canActivate: [],
        canActivateChild: [],
        data: {
            // permission: PERMISSIONS.VIEW_PRICING_CONDITIONS
        },
        loadChildren: () => import('./conditions/conditions.module').then(m => m.ConditionsModule)
    }
]

