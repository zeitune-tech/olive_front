import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./pricing.routing";

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [],
    providers: []
})

export class PricingModule {
    constructor() {
        // Module initialization logic can go here
    }
}
