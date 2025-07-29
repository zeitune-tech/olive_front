import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import {ConstantListComponent} from "./list/list.component";

export const routes: Routes = [
    {
        path: '',
        canActivate: [],
        canActivateChild: [],
        data: {
            // permission: PERMISSIONS.VIEW_PRICING_CONSTANT
        },
      component: ConstantListComponent
    },
]
