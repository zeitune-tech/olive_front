import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { ClosuresListComponent } from "./list/list.component";
import { ClosuresNewComponent } from "./new/new.component";

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "list",
    },
    {
        path: "list",
        component: ClosuresListComponent
    },
    {
        path: "new",
        component: ClosuresNewComponent
    }
];