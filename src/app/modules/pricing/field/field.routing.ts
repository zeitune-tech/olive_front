import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import {FieldListComponent} from "./list/list.component";
import {SelectFieldOptionsListComponent} from "./select-options/list/list.component";

export const routes: Routes = [
    {
        path: 'list',
        canActivate: [],
        canActivateChild: [],
        data: {
            // permission: PERMISSIONS.VIEW_PRICING_CONSTANT
        },
      component: FieldListComponent
    },
    {
        path: 'select-options',
        canActivate: [],
        canActivateChild: [],
        data: {
            // permission: PERMISSIONS.CREATE_PRICING_CONSTANT
        },
        component: SelectFieldOptionsListComponent
    }

]
