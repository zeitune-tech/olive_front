import { Routes } from "@angular/router";
import { ProductsListComponent } from "./list/list.component";
import { ProductsNewComponent } from "./new/new.component";


export const routes: Routes = [
    {
        path: "",
        redirectTo: "list",
        pathMatch: "full"
    },
    {
        path: "list",
        component: ProductsListComponent
    },
    {
        path: "new",
        component: ProductsNewComponent
    },
    {
        path: ":id",
        component: ProductsNewComponent
    }
]