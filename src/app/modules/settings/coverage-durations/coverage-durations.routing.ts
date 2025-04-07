import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { CoverageDurationsListComponent } from "./list/list.component";
import { CoverageDurationNewComponent } from "./new/new.component";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "list",
        pathMatch: "full",
    },
    {
        path: "list",
        component: CoverageDurationsListComponent
    },
    {
        path: "new",
        component: CoverageDurationNewComponent
    }
];