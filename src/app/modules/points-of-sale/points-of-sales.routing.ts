import { Routes } from "@angular/router";
import { PointsOfSaleListComponent } from "./list/list.component";
import { BrokerPointsOfSaleListComponent } from "./broker/broker.component";
import { PointsOfSaleNewComponent } from "./new/new.component";

export const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: PointsOfSaleListComponent },
    { path: 'new', component: PointsOfSaleNewComponent },
    { path: 'broker', component: BrokerPointsOfSaleListComponent }
]
