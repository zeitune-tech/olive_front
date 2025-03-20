import { NgModule } from "@angular/core";
import { InsuredListComponent } from "./list/list.component";
import { RouterModule } from "@angular/router";
import { routes } from "./insureds.routes";
import { InsuredsNewComponent } from "./new/new.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TableModule } from "@lhacksrt/components/table/table.module";
import { SharedModule } from "@shared/shared.module";
import { StepOneComponent } from "./new/step-one/step-one.component";
import { StepTwoComponent } from "./new/step-two/step-two.component";
import { StepThreeComponent } from "./new/step-three/step-three.component";
import { DialogModule } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatStepperModule } from "@angular/material/stepper";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

@NgModule({
    declarations: [
        InsuredListComponent,
        InsuredsNewComponent,
        StepOneComponent,
        StepTwoComponent,
        StepThreeComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatIconModule,
        SharedModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatTooltipModule,
        TableModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatDividerModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        CommonModule,
        RouterModule,
        DialogModule,
    ],
    providers: [],
    exports: []
})
export class InsuredsModule { }