import { Routes } from "@angular/router";
import { EndorsementListComponent } from "./list/list.component";
import { EndorsementNewComponent } from "./new/new.component";

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "list",
    },
    {
        path: "list",
        component: EndorsementListComponent,
    }
];