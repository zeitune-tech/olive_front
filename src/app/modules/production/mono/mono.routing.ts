import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { NewBusinessComponent } from "./new-business/form/new-business.component";
import { ProductionListComponent } from "./list/list.component";

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "new-business",
    },
   {
    path: "new-business",
    canActivate: [],
    canActivateChild: [],
    data: {
        // permission: PERMISSIONS.CREATE_PRODUCTION
    },
    component: NewBusinessComponent
   },
   {
    path: "list-business",
    canActivate: [],
    canActivateChild: [],
    data: {

    },
    component: ProductionListComponent
   }
];