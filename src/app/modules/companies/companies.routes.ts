import { Routes } from "@angular/router";
import { LinkedCompaniesListComponent } from "./linked-list/linked-list.component";
import { CompaniesListComponent } from "./list/list.component";

export const routes: Routes = [
    { path: '', redirectTo: 'linked', pathMatch: 'full' },
    { path: 'linked', component: LinkedCompaniesListComponent},
    { path: 'list', component: CompaniesListComponent},
]
