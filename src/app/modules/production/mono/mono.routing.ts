import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { ContractNewComponent } from "./new-standard/new-standard.component";

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "new",
    },
   {
    path: "new",
    canActivate: [],
    canActivateChild: [],
    data: {
        // permission: PERMISSIONS.CREATE_PRODUCTION
    },
    component: ContractNewComponent
   }
];