import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { RouterModule } from "@angular/router";
import { routes } from "./constants.routing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TableModule } from "@lhacksrt/components/table/table.module";
import { LayoutService } from "./layout.service";
import { ConstantListComponent } from "./list/list.component";
import { ConstantService } from "@core/services/pricing/constant/constant.service";
import { Constant } from "@core/services/pricing/constant/constant.interface";
import { ConstantFormComponent } from "./form/form.component";

@NgModule({
    declarations: [
      ConstantListComponent,
      ConstantFormComponent
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
        ConstantService
    ]
})
export class ConstantsModule {
    constructor() {
        // Module initialization logic can go here
    }
}
