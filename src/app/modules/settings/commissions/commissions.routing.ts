import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { PrimesListComponent } from "./list-primes/list.component";
import { ContributorsListComponent } from "./list-contributors/list.component";
import { TaxesListComponent } from "./list-taxes/list.component";
import { AccessoriesListComponent } from "./list-accessories/list.component";
import { CommissionNewComponent } from "./new/new.component";

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "primes",
    },
    {
        path: "primes",
        component: PrimesListComponent
    },
    {
        path: "contributors",
        component: ContributorsListComponent
    },
    {
        path: "taxes",
        component: TaxesListComponent
    },
    {
        path: "accessories",
        component: AccessoriesListComponent
    },
    {
        path: "new",
        component: CommissionNewComponent
    }
];