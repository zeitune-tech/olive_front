import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import {SelectFieldOptionsListComponent} from "./select-options/list/list.component";
import {SelectFieldOptionValueListComponent} from "./select-option-value/list/list.component";

export const routes: Routes = [
    {
      path: 'list',
      canActivate: [],
      canActivateChild: [],
      data: {
        // permission: PERMISSIONS.CREATE_PRICING_CONSTANT
      },
      component: SelectFieldOptionsListComponent
    },
    {
      path: 'values',
      canActivate: [],
      canActivateChild: [],
      data: {
        // permission: PERMISSIONS.CREATE_PRICING_CONSTANT
      },
      component: SelectFieldOptionValueListComponent
    },

]
