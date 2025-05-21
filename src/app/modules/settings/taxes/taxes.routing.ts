import { Routes } from "@angular/router";
import { TaxRegimesListComponent } from "./tax-regimes/list.component";
import { TaxesNewComponent } from "./new/new.component";
import { BaseTaxesListComponent } from './base-taxes/list.component';
import { TaxesListComponent } from "./list/list.component";
import { AccessoriesListComponent } from "./list-accessories/list.component";
import { PrimesListComponent } from "./list-primes/list.component";

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "list",
    },
    {
        path: "list",
        component: TaxesListComponent
    },
    {
        path: "accessories",
        component: AccessoriesListComponent
    },
    {
        path: "tax-regimes",
        component: TaxRegimesListComponent
    },
    {
        path: "base-taxes",
        component: BaseTaxesListComponent
    },
    {
        path: "primes",
        component: PrimesListComponent
    },
    {
        path: "new",
        component: TaxesNewComponent
    }
];