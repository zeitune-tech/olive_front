import { Routes } from "@angular/router";
import { EndorsementListComponent } from "./list/list.component";
import { EndorsementSuccessionComponent } from "./endorsement-succession/endorsement-succession.component";
import { EndorsementAccessComponent } from "./endorsement-access/endorsement-access.component";

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "list",
    },
    {
        path: "list",
        component: EndorsementListComponent,
    },
    {
        path: "successions",
        component: EndorsementSuccessionComponent,
    },
    {
        path: "access",
        component: EndorsementAccessComponent,
    }
];