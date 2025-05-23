import { Routes } from "@angular/router";
import { DurationRateListComponent } from "./list/list.component";
import { DurationRateNewComponent } from "./new/new.component";

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "primes",
    },
    {
        path: "list",
        component: DurationRateListComponent
    },
    {
        path: "new",
        component: DurationRateNewComponent
    }
];