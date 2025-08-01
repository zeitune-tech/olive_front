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
      path: 'variable-conditions',
      canActivate: [],
      canActivateChild: [],
      data: {
        // permission: PERMISSIONS.VIEW_PRICING_FORMULA
      },
      loadChildren: () => import('./variable-condition/variable-condition.module').then(m => m.VariableConditionModule)
    },
    {
      path: 'fields',
      canActivate: [],
      canActivateChild: [],
      data: {
        // permission: PERMISSIONS.VIEW_PRICING_FORMULA
      },
      loadChildren: () => import('./field/field.module').then(m => m.FieldModule)
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
    // {
    //     path: 'caracteristics',
    //     canActivate: [],
    //     canActivateChild: [],
    //     data: {
    //         // permission: PERMISSIONS.VIEW_PRICING_CARACTERISTICS
    //     },
    //     loadChildren: () => import('./caracteristics/caracteristics.module').then(m => m.CaracteristicsModule)
    // },
    // {
    //     path: 'conditions',
    //     canActivate: [],
    //     canActivateChild: [],
    //     data: {
    //         // permission: PERMISSIONS.VIEW_PRICING_CONDITIONS
    //     },
    //     loadChildren: () => import('./conditions/conditions.module').then(m => m.VariableConditionModule)
    // }
]

