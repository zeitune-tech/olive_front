import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { CoveragesListComponent } from "./list-coverages/list.component";
import { CoverageReferentialsListComponent } from "./list-referentials/list.component";
import { IncompatibleCoveragesListComponent } from "./list-incompatibilities/list.component";
import { CoveragesNewComponent } from "./new-coverage/new.component";
import { IncompatibleCoveragesNewComponent } from "./new-incompatibility/new.component";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "list",
        pathMatch: "full",
    },
    {
        path: "list",
        component: CoveragesListComponent,
    },
    {
        path: "referentials",
        component: CoverageReferentialsListComponent,
    },
    {
        path: "incompatibilities",
        component: IncompatibleCoveragesListComponent
    },
    {
        path: "new",
        component: CoveragesNewComponent
    },
    {
        path: "new-incompatibility",
        component: IncompatibleCoveragesNewComponent
    }
];