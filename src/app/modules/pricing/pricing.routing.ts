import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const routes: Routes = [
  {
    path: 'production/parameters/constants',
    canActivate: [],
    canActivateChild: [],
    data: {
      // permission: PERMISSIONS.VIEW_PRICING_CONSTANTS
    },
    loadChildren: () => import('./constants/constants.module').then(m => m.ConstantsModule)
  },
  {
    path: 'production/parameters/fields',
    canActivate: [],
    canActivateChild: [],
    data: {
      // permission: PERMISSIONS.VIEW_PRICING_FORMULA
    },
    loadChildren: () => import('./field/field.module').then(m => m.FieldModule)
  },
  {
    path: 'production/parameters/variable-conditions',
    canActivate: [],
    canActivateChild: [],
    data: {
      // permission: PERMISSIONS.VIEW_PRICING_FORMULA
    },
    loadChildren: () => import('./variable-condition/variable-condition.module').then(m => m.VariableConditionModule)
  },
  {
    path: 'production/parameters/formula',
    canActivate: [],
    canActivateChild: [],
    data: {
      // permission: PERMISSIONS.VIEW_PRICING_FORMULA
    },
    loadChildren: () => import('./formula/formula.module').then(m => m.FormulaModule)
  },

]

