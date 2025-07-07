import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { ConditionsNewComponent } from "./new/new.component";
import { ConditionsListComponent } from "./list/list.component";

export const routes: Routes = [
    
    {
        path: 'new',
        canActivate: [],
        canActivateChild: [],
        data: {
            // permission: PERMISSIONS.CREATE_PRICING_FORMULA
        },
        component: ConditionsNewComponent
    },
    {
        path: 'list',
        canActivate: [],
        canActivateChild: [],
        data: {
            // permission: PERMISSIONS.VIEW_PRICING_FORMULA
        },
        component: ConditionsListComponent
    }
]