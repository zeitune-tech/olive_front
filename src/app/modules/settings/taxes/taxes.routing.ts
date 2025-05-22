import { Routes } from "@angular/router";
import { TaxRegimesListComponent } from "./tax-regimes/list.component";
import { TaxNewComponent } from "./new/new.component";
import { BaseTaxesListComponent } from './base-taxes/list.component';
import { TaxesListComponent } from "./list/list.component";
import { BaseTaxNewComponent } from "./new-base-tax/new-base-tax.component";
import { TaxRegimeNewComponent } from "./new-tax-regime/new-tax-regime.component";

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
        path: "regimes",
        component: TaxRegimesListComponent
    },
    {
        path: "regimes-new",
        component: TaxRegimeNewComponent
    },
    {
        path: "base-taxes",
        component: BaseTaxesListComponent
    },
    {
        path: "base-taxes-new",
        component: BaseTaxNewComponent
    },
    {
        path: "new",
        component: TaxNewComponent
    }
];