import { Routes } from "@angular/router";
import { EntitySuperiorListComponent } from "./list/list.component";
import { LinkedEntitySuperiorListComponent } from "./linked-list/linked-list.component";

export const routes: Routes = [
    { path: '', redirectTo: 'linked', pathMatch: 'full' },
    { path: 'linked', component: LinkedEntitySuperiorListComponent },
    { path: 'list', component: EntitySuperiorListComponent },
]
