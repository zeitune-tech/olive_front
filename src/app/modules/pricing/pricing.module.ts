import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./pricing.routing";
import {PricingSelectionHeaderComponent} from "./shared/components/selection-header/pricing-selection-header.component";
import {SelectionService} from "./shared/services/selection.service";

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [],
    providers: [
    ]
})

export class PricingModule {
    constructor() {
        // Module initialization logic can go here
    }
}
