import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PricingSelectionHeaderComponent } from "./components/selection-header/pricing-selection-header.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SelectionService } from "./services/selection.service";
import { SharedModule } from "@shared/shared.module";
import {MatDialogModule} from "@angular/material/dialog";
import {PricingTypeService} from "@core/services/pricing/pricing-type/pricing-type.service";
import { FormulaViewerComponent } from './components/formula-viewer/formula-viewer.component';
import {MatChipsModule} from "@angular/material/chips";

@NgModule({
    declarations: [
      PricingSelectionHeaderComponent,
      FormulaViewerComponent
    ],
    imports: [
      CommonModule,
      SharedModule,
      MatButtonModule,
      MatIconModule,
      MatTooltipModule,
      MatChipsModule,
    ],
  exports: [
    PricingSelectionHeaderComponent,
    FormulaViewerComponent
  ],
    providers: [
      SelectionService,
      PricingTypeService,
    ]
})

export class PricingSharedModule {
    constructor() {
        // Module initialization logic can go here
    }
}
