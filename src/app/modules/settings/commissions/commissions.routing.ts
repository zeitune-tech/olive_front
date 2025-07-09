import { Routes } from "@angular/router";

import { CommissionPrimeListComponent } from "./commission-prime/list/list.component";
import { CommissionPrimeContributorListComponent } from "./commission-prime-contributor/list/list.component";
import { CommissionAccessoryListComponent } from "./commission-accessory/list/list.component";
import { CommissionAccessoryContributorListComponent } from "./commission-accessory-contributor/list/list.component";
import { TaxCommissionListComponent } from "./tax-commission/list/list.component";
import { TaxCommissionFormComponent } from "./tax-commission/form/form.component";
import { TaxCommissionsContributorListComponent } from "./tax-commission-contributor/list/list.component";


export const routes: Routes = [

    {
        path: "",
        component: CommissionPrimeListComponent,
    },
    {
        path: "primes",
        component: CommissionPrimeListComponent,
    },
    {
        path: "contributors-primes",
        component: CommissionPrimeContributorListComponent,
    },
    {
        path: "accessories",
        component: CommissionAccessoryListComponent,
    },
    {
        path: "contributors-accessories",
        component: CommissionAccessoryContributorListComponent,
    },
    {
        path: "taxes",
        component: TaxCommissionListComponent,
    },
    {
        path: "contributors-taxes",
        component: TaxCommissionsContributorListComponent,
    }
];