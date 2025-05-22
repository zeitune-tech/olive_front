import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./insured.routing";

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes)
    ],
    providers: [],
    exports: [],
})
export class InsuredModule { }