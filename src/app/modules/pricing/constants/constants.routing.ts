import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { ConstantsNewComponent } from "./new/new.component";
import { CompaniesListComponent } from "../../admin/companies/list/list.component";

export const routes: Routes = [
    
    {
        path: 'new',
        canActivate: [],
        canActivateChild: [],
        data: {
            // permission: PERMISSIONS.CREATE_PRICING_FORMULA
        },
        component: ConstantsNewComponent
    },
    {
        path: 'list',
        canActivate: [],
        canActivateChild: [],
        data: {
            // permission: PERMISSIONS.VIEW_PRICING_FORMULA
        },
        component: CompaniesListComponent
    },
]