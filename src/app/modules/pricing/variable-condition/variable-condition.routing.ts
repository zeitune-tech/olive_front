import {Routes} from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import {VariableConditionListComponent} from "./list/list.component";

export const routes: Routes = [

    {
        path: 'list',
        canActivate: [],
        canActivateChild: [],
        data: {
            // permission: PERMISSIONS.CREATE_PRICING_FORMULA
        },
      component: VariableConditionListComponent
    },
    // {
    //   path: 'rules',
    //   canActivate: [],
    //   canActivateChild: [],
    //   data: {
    //       // permission: PERMISSIONS.CREATE_PRICING_FORMULA
    //   },
    //   loadChildren: () => import('./rule/rule.module').then(m => m.RuleModule)
    // }
]
