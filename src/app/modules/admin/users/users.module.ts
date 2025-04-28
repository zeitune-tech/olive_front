import { NgModule } from "@angular/core";
import { UsersListComponent } from "./list/list.component";
import { RouterModule } from "@angular/router";
import { routes } from "./users.routing";
import { UsersNewComponent } from "./new/new.component";
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
import { MatStepperModule } from "@angular/material/stepper";
import { DialogModule } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { StepThreeComponent } from "./new/step-three/step-three.component";
import { StepFourComponent } from "./new/step-four/step-four.component";
import { StepFiveComponent } from "./new/step-five/step-five.component";
import { UsersLayoutComponent } from "./layout/layout.component";
import { ChangePointOfSaleDialogComponent } from "./change-point-of-sale-dialog/change-point-of-sale-dialog.component";
import { StepperDataService } from "./new/form.service";

@NgModule({
    declarations: [
        UsersListComponent,
        UsersNewComponent,
        StepOneComponent,
        StepTwoComponent,
        StepThreeComponent,
        StepFourComponent,
        StepFiveComponent,
        UsersLayoutComponent,
        ChangePointOfSaleDialogComponent
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
        MatSelectModule,
        MatDividerModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        CommonModule,
        RouterModule,
        DialogModule,
    ],
    providers: [
        StepperDataService
    ],
    exports: []
})
export class UsersModule { }