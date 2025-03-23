import { Routes } from "@angular/router";
import { LinkedMarketLevelOrganizationListComponent } from "./linked-list/linked-list.component";
import { MarketLevelOrganizationListComponent } from "./list/list.component";

export const routes: Routes = [
    { path: '', redirectTo: 'linked', pathMatch: 'full' },
    { path: 'linked', component: LinkedMarketLevelOrganizationListComponent },
    { path: 'list', component: MarketLevelOrganizationListComponent },
]
