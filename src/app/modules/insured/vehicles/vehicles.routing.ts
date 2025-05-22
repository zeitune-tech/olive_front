import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { VehiclesListComponent } from "./list/list.component";
import { VehicleNewComponent } from "./new/new.component";

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "list",
    },
    {
        path: "list",
        component: VehiclesListComponent
    },
    {
        path: "new",
        component: VehicleNewComponent
    }
];