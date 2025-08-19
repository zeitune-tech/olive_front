import {Routes} from "@angular/router";
import {PERMISSIONS} from "@core/permissions/permissions.data";
import {VehicleCategoryListComponent} from "./vehicle-category/list/list.component";
import {VehicleUsageListComponent} from "./vehicle-usage/list/list.component";

export const routes: Routes = [
  {
    path: 'vehicle-categories',
    canActivate: [],
    canActivateChild: [],
    data: {
      // permission: PERMISSIONS.VIEW_PRICING_CONSTANT
    },
    component: VehicleCategoryListComponent
  },
  {
    path: 'vehicle-usages',
    canActivate: [],
    canActivateChild: [],
    data: {
      // permission: PERMISSIONS.VIEW_PRICING_CONSTANT
    },
    component: VehicleUsageListComponent
  },
  {
    path: 'vehicle-references',
    canActivate: [],
    canActivateChild: [],
    data: {
      // permission: PERMISSIONS.VIEW_PRICING_CONSTANT
    },
    loadChildren: () => import('./vehicle-references/vehicle-references.module').then(m => m.VehicleReferencesModule)
  }

]
