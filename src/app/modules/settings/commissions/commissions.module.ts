import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./commissions.routing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TableModule } from "@lhacksrt/components/table/table.module";
import { SharedModule } from "@shared/shared.module";
import { ContributorsListComponent } from "./list-contributors/list.component";
import { TaxesListComponent } from "./list-taxes/list.component";
import { CommissionNewComponent } from "./new/new.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatStepperModule } from "@angular/material/stepper";
import { MatRadioModule } from "@angular/material/radio";
import { CommissionListComponent } from "./list/list.component";
import { CommissionTaxNewComponent } from "./new-tax/new-tax.component";
import { CommissionContributorNewComponent } from "./new-contributor/new-contributor.component";

@NgModule({
    declarations: [
        CommissionListComponent,
        ContributorsListComponent,
        TaxesListComponent,
        CommissionNewComponent,
        CommissionTaxNewComponent,
        CommissionContributorNewComponent
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
        MatProgressSpinnerModule,
        MatStepperModule,
        MatCheckboxModule,
        MatRadioModule
    ],
    providers: [],
    exports: [],
})
export class CommissionsModule { }