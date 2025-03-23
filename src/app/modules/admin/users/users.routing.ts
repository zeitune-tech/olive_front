import { Routes } from "@angular/router";
import { UsersListComponent } from "./list/list.component";
import { UsersNewComponent } from "./new/new.component";

export const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: UsersListComponent },
    { path: 'new', component: UsersNewComponent }
]
