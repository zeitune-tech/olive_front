import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { CoveragesListComponent } from "./list-coverages/list.component";
import { CoverageReferenceListComponent } from "./list-references/list.component";
import { IncompatibleCoveragesListComponent } from "./list-incompatibilities/list.component";
import { IncompatibleCoveragesNewComponent } from "./new-incompatibility/new.component";
import { CoverageReferenceNewComponent } from "./new-reference/new.component";

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
        component: CoverageReferenceListComponent,
    },
    {
        path: "incompatibilities",
        component: IncompatibleCoveragesListComponent
    },
    {
        path: "new",
        component: CoverageReferenceNewComponent
    },
    {
        path: "new-incompatibility",
        component: IncompatibleCoveragesNewComponent
    }
];