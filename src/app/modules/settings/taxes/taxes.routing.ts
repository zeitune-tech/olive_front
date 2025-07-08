import { Routes } from "@angular/router";
import {TypeListComponent} from "./taxes-type/list/list.component";
import {PrimesListComponent} from "./taxes-primes/list/list.component";
import {ExemptionListComponent} from "./taxes-exemption/list/list.component";
import {DimensionStampListComponent} from "./dimension-stamp/list/list.component";
import {GraduatedStampListComponent} from "./graduated-stamp/list/list.component";
import {AccessoriesListComponent} from "./taxes-accessories/list/list.component";

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "taxes-type",
    },
    {
        path: "taxes-type",
        component: TypeListComponent
    },
    {
        path: "taxes-primes",
        component: PrimesListComponent
    },
    {
        path: "taxes-accessories",
        component: AccessoriesListComponent
    },
    {
        path: "taxes-exemption",
        component: ExemptionListComponent
    },
    {
        path: "dimension-stamp",
        component: DimensionStampListComponent
    },
    {
        path: "graduated-stamp",
        component: GraduatedStampListComponent
    }
];
