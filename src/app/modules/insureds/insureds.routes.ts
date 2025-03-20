import { Routes } from "@angular/router";
import { InsuredListComponent } from "./list/list.component";
import { InsuredsNewComponent } from "./new/new.component";

export const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: InsuredListComponent },
    { path: 'new', component: InsuredsNewComponent },
]
