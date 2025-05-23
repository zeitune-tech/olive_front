import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./production.routing";

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild(routes)
    ],
    providers: [],
    exports: [],
})
export class ProductionModule { }