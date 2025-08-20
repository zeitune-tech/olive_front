import {Routes} from "@angular/router";
import {PERMISSIONS} from "@core/permissions/permissions.data";
import {VehicleBrandListComponent} from "./vehicle-brand/list/list.component";
import {VehicleDTTReferentialListComponent} from "./vehicle-dtt-referential/list/list.component";
import {VehicleModelListComponent} from "./vehicle-model/list/list.component";

export const routes: Routes = [
  {
    path: 'brands',
    canActivate: [],
    canActivateChild: [],
    data: {
      // permission: PERMISSIONS.VIEW_PRICING_CONSTANT
    },
    component: VehicleBrandListComponent,
  },
  {
    path: 'models',
    canActivate: [],
    canActivateChild: [],
    data: {
      // permission: PERMISSIONS.VIEW_PRICING_CONSTANT
    },
    component: VehicleModelListComponent,
  },
  {
    path: 'dtt',
    canActivate: [],
    canActivateChild: [],
    data: {
      // permission: PERMISSIONS.VIEW_PRICING_CONSTANT
    },
    component: VehicleDTTReferentialListComponent,
  },

]
