import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import {FormulaListComponent} from "./list/list.component";
import {FormulaNewComponent} from "./new/new.component";

export const routes: Routes = [
  {
      path: 'create',
      canActivate: [],
      canActivateChild: [],
      data: {
          // permission: PERMISSIONS.CREATE_PRICING_FORMULA
      },
      component: FormulaNewComponent
  },
  {
       path: 'list',
       canActivate: [],
       canActivateChild: [],
       data: {
         // permission: PERMISSIONS.VIEW_PRICING_FORMULA
       },
       component: FormulaListComponent
  },

]
