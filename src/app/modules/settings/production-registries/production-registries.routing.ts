import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { ProductionRegistriesListComponent } from "./list/list.component";
import { ProductionRegistryNewComponent } from "./new/new.component";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "list",
        pathMatch: "full",
    },
    {
        path: "list",
        component: ProductionRegistriesListComponent
    },
    {
        path: "new",
        component: ProductionRegistryNewComponent
    }
];