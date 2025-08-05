import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { PricingNewComponent } from "./new/new.component";
import {FormulaListComponent} from "./list/list.component";

export const routes: Routes = [
  {
      path: 'create',
      canActivate: [],
      canActivateChild: [],
      data: {
          // permission: PERMISSIONS.CREATE_PRICING_FORMULA
      },
      component: PricingNewComponent
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
