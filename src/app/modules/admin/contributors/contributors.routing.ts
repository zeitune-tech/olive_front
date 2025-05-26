import { Routes } from "@angular/router";
import { ContributorsListComponent } from "./list/list.component";
import { ContributorNewComponent } from "./new/new.component";

export const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: ContributorsListComponent },
    { path: 'new', component: ContributorNewComponent },
]
