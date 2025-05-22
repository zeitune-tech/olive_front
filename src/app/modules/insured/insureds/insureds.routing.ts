import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { InsuredsListComponent } from "./list/list.component";
import { InsuredNewComponent } from "./new/new.component";

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "list",
    },
    {
        path: "list",
        component: InsuredsListComponent
    },
    {
        path: "new",
        component: InsuredNewComponent
    }
];