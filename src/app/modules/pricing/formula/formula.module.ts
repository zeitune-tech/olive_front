import { NgModule } from "@angular/core";
import { PricingNewComponent } from "./new/new.component";
import { RouterModule } from "@angular/router";
import { routes } from "./formula.routing";
import { SharedModule } from "@shared/shared.module";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PricingFormulaListComponent } from "./list/list.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TableModule } from "@lhacksrt/components/table/table.module";
import { FormulaEditComponent } from "./edit/edit.component";
import { LayoutService } from "./layout.service";
import { FormulaService } from "@core/services/pricing/formula/formula.service";
import { ConstantService } from "@core/services/pricing/constant/constant.service";
import { FieldService } from "@core/services/pricing/field/field.service";
import { SelectFieldOptionsService } from "@core/services/pricing/field/select-field-options/select-field-options.service";
import { VariableItemService } from "@core/services/pricing/variable-item/variable-item.service";

@NgModule({
    declarations: [
        PricingNewComponent,
        PricingFormulaListComponent,
        FormulaEditComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatTooltipModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDividerModule,
        ReactiveFormsModule,
        SharedModule,
        TableModule,
        MatProgressSpinnerModule,
    ],
    exports: [],
    providers: [
        LayoutService,
        FormulaService,
        ConstantService,
        FieldService,
        SelectFieldOptionsService,
        VariableItemService
    ]
})
export class FormulaModule {
    constructor() {
        // Module initialization logic can go here
    }
}
