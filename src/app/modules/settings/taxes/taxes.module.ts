import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./taxes.routing";
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
import { TaxRegimesListComponent } from "./tax-regimes/list.component";
import { TaxNewComponent } from "./new/new.component";
import { BaseTaxesListComponent } from "./base-taxes/list.component";
import { AccessoriesListComponent } from "./list-accessories/list.component";
import { PrimesListComponent } from "./list-primes/list.component";
import { TaxesListComponent } from "./list/list.component";
import { BaseTaxNewComponent } from "./new-base-tax/new-base-tax.component";
import { TaxRegimeNewComponent } from "./new-tax-regime/new-tax-regime.component";
import { MatCheckboxModule } from "@angular/material/checkbox";

@NgModule({
    declarations: [
        TaxesListComponent,
        TaxRegimesListComponent,
        BaseTaxesListComponent,
        AccessoriesListComponent,
        PrimesListComponent,
        TaxNewComponent,
        BaseTaxNewComponent,
        TaxRegimeNewComponent
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
        MatCheckboxModule
    ],
    providers: [],
    exports: [],
})
export class TaxesModule { }