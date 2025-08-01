  import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
  import {VariableConditionListComponent} from "./list/list.component";

export const routes: Routes = [

    {
        path: '',
        canActivate: [],
        canActivateChild: [],
        data: {
            // permission: PERMISSIONS.CREATE_PRICING_FORMULA
        },
        // component: null
      component: VariableConditionListComponent
    },

]
