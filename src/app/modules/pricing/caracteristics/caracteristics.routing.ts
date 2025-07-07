import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { CaracteristicNewComponent } from "./new/new.component";
import { CaracteristicListComponent } from "./list/list.component";

export const routes: Routes = [
    
    {
        path: 'new',
        canActivate: [],
        canActivateChild: [],
        data: {
            // permission: PERMISSIONS.CREATE_PRICING_FORMULA
        },
        component: CaracteristicNewComponent
    },
    {
        path: 'list',
        canActivate: [],
        canActivateChild: [],
        data: {
            // permission: PERMISSIONS.VIEW_PRICING_FORMULA
        },
        component: CaracteristicListComponent
    }
]