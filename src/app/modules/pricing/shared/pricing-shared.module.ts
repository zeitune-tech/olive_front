import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PricingSelectionHeaderComponent } from "./components/selection-header/pricing-selection-header.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SelectionService } from "./services/selection.service";
import { SharedModule } from "@shared/shared.module";
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
    declarations: [
      PricingSelectionHeaderComponent
    ],
    imports: [
      CommonModule,
      SharedModule,
      MatButtonModule,
      MatIconModule,
      MatTooltipModule,
    ],
    exports: [
      PricingSelectionHeaderComponent
    ],
    providers: [
      SelectionService
    ]
})

export class PricingSharedModule {
    constructor() {
        // Module initialization logic can go here
    }
}
