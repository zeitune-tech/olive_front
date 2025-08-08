import { Routes } from "@angular/router";
import { ContributorsListComponent } from "./list/list.component";
import { ContributorNewComponent } from "./new/new.component";
import { ContributorsTypeListComponent } from "./contributor-type/list.component";

export const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: ContributorsListComponent },
    { path: 'types', component: ContributorsTypeListComponent },
    { path: 'new', component: ContributorNewComponent },
]
