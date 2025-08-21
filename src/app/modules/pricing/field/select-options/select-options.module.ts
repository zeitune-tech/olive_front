import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { RouterModule } from "@angular/router";
import { routes } from "./select-options.routing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogActions, MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TableModule } from "@lhacksrt/components/table/table.module";
import { SelectFieldOptionValueService } from "@core/services/pricing/field/select-field/select-field-option-value/select-field-option-value.service";
import {SelectFieldOptionValueListComponent} from "./select-option-value/list/list.component";
import {SelectFieldOptionValueFormComponent} from "./select-option-value/form/form.component";
import {SelectFieldOptionsListComponent} from "./select-options/list/list.component";
import {SelectFieldOptionsFormComponent} from "./select-options/form/form.component";
import {SelectFieldOptionsService} from "@core/services/pricing/field/select-field/select-field-options/select-field-options.service";

@NgModule({
    declarations: [
      SelectFieldOptionsListComponent,
      SelectFieldOptionsFormComponent,
      SelectFieldOptionValueListComponent,
      SelectFieldOptionValueFormComponent
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
        ReactiveFormsModule,
        SharedModule,
        TableModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        MatDialogModule,
        MatDialogActions,
        MatFormFieldModule,
    ],
    exports: [],
    providers: [
      SelectFieldOptionsService,
      SelectFieldOptionValueService
    ]
})
export class SelectOptionsModule {
    constructor() {
        // Module initialization logic can go here
    }
}
