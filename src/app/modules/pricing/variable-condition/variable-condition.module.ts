import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./variable-condition.routing";
import { SharedModule } from "@shared/shared.module";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogActions, MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { TableModule } from "@lhacksrt/components/table/table.module";
import { LayoutService } from "./layout.service";
import { VariableConditionListComponent } from "./list/list.component";
import { VariableConditionService } from "@core/services/pricing/variable-condition/variable-condition.service";
import { VariableConditionFormComponent } from "./form/form.component";
import { FieldService } from "@core/services/pricing/field/field.service";

@NgModule({
    declarations: [
        VariableConditionListComponent,
        VariableConditionFormComponent
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
        MatDividerModule,
        MatDialogModule,
        MatDialogActions
    ],
    exports: [],
    providers: [
        LayoutService,
        VariableConditionService,
        FieldService
    ]
})

export class VariableConditionModule {
    constructor() {
        // Module initialization logic can go here
    }
}
