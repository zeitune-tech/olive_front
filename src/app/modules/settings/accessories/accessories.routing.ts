import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { AccessoriesListComponent } from "./list/list.component";
import { AccessoryNewComponent } from "./new/new.component";

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "list",
    },
    {
        path: "list",
        component: AccessoriesListComponent
    },
    {
        path: "new",
        component: AccessoryNewComponent
    }
];