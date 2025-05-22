import { Routes } from "@angular/router";
import { ContributorsListComponent } from "./list-contributors/list.component";
import { TaxesListComponent } from "./list-taxes/list.component";
import { CommissionNewComponent } from "./new/new.component";
import { CommissionListComponent } from "./list/list.component";
import { CommissionContributorNewComponent } from "./new-contributor/new-contributor.component";
import { CommissionTaxNewComponent } from "./new-tax/new-tax.component";

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "primes",
    },
    {
        path: "list",
        component: CommissionListComponent
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
        path: "new",
        component: CommissionNewComponent
    },
    {
        path: "contributors-new",
        component: CommissionContributorNewComponent
    },
    {
        path: "taxes-new",
        component: CommissionTaxNewComponent
    }
];