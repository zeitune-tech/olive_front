import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LotAttestationsListComponent } from "./list/list.component";
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
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TableModule } from "@lhacksrt/components/table/table.module";
import { SharedModule } from "@shared/shared.module";
import { LotAttestationsNewComponent } from "./new/new.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

const routes: Routes = [
    {
        path: '',
        component: LotAttestationsListComponent
    }
];


@NgModule({
    declarations: [
        LotAttestationsListComponent,
        LotAttestationsNewComponent
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
        MatProgressSpinnerModule
    ],
    providers: [],
    exports: [],
})
export class StockModule { }