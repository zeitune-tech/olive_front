import { Routes } from "@angular/router";
import { CompanyLevelOrganizationListComponent } from "./list/list.component";
import { CompanyLevelOrganizationNewComponent } from "./new/new.component";
import { CompanyLevelOrganizationEditComponent } from "./edit/edit.component";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "list",
        pathMatch: "full"
    },
    {
        path: "list",
        component: CompanyLevelOrganizationListComponent
    },
    {
        path: "new",
        component: CompanyLevelOrganizationNewComponent
    },
    {
        path: ":id",
        component: CompanyLevelOrganizationEditComponent
    }
]