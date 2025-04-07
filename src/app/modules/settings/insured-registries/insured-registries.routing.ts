import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { InsuredRegistriesListComponent } from "./list/list.component";
import { InsuredRegistryNewComponent } from "./new/new.component";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "list",
        pathMatch: "full",
    },
    {
        path: "list",
        component: InsuredRegistriesListComponent
    },
    {
        path: "new",
        component: InsuredRegistryNewComponent
    }
];