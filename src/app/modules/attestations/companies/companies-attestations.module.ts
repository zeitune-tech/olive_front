import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { TableModule } from "@lhacksrt/components/table/table.module";
import { SharedModule } from "@shared/shared.module";
import { CompaniesAttestationsComponent } from "./list/companies.component";
import { RevokedCompaniesAttestationsComponent } from "./revoked/revoked.component";
import { CompanyAttestationsNewComponent } from "./new/new.component";

const routes: Routes = [
    {
        path: "list",
        component: CompaniesAttestationsComponent,
    },
    {
        path: "revoked",
        component: RevokedCompaniesAttestationsComponent,
    }
];

@NgModule({
    declarations: [
        CompaniesAttestationsComponent,
        CompanyAttestationsNewComponent,
        RevokedCompaniesAttestationsComponent
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
        MatCheckboxModule,
        MatInputModule,
        MatSelectModule,
        MatDividerModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatStepperModule,
    ],
    providers: [],
    exports: [],
})
export class CompaniesAttestationsModule { }