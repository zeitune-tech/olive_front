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
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatStepperModule } from "@angular/material/stepper";
import { MatRadioModule } from "@angular/material/radio";
import { CommissionPrimeFormComponent } from "./commission-prime/form/form.component";
import { CommissionPrimeListComponent } from "./commission-prime/list/list.component";
import { CommissionPrimeContributorFormComponent } from "./commission-prime-contributor/form/form.component";
import { CommissionPrimeContributorListComponent } from "./commission-prime-contributor/list/list.component";
import { CommissionAccessoryFormComponent } from "./commission-accessory/form/form.component";
import { CommissionAccessoryListComponent } from "./commission-accessory/list/list.component";
import { CommissionAccessoryContributorFormComponent } from "./commission-accessory-contributor/form/form.component";
import { CommissionAccessoryContributorListComponent } from "./commission-accessory-contributor/list/list.component";
import { TaxCommissionListComponent } from "./tax-commission/list/list.component";
import { TaxCommissionFormComponent } from "./tax-commission/form/form.component";
import { TaxCommissionContributorFormComponent } from "./tax-commission-contributor/form/form.component";
import { TaxCommissionsContributorListComponent } from "./tax-commission-contributor/list/list.component";

@NgModule({
    declarations: [
        CommissionPrimeFormComponent,
        CommissionPrimeListComponent,
        CommissionPrimeContributorFormComponent,
        CommissionPrimeContributorListComponent,
        CommissionAccessoryFormComponent,
        CommissionAccessoryListComponent,
        CommissionAccessoryContributorFormComponent,
        CommissionAccessoryContributorListComponent,
        TaxCommissionListComponent,
        TaxCommissionFormComponent,
        TaxCommissionContributorFormComponent,
        TaxCommissionsContributorListComponent
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
        MatRadioModule,
        SharedModule
    ],
    providers: [],
    exports: [],
})
export class CommissionsModule { }