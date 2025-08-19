import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./endorsments.routing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogContent, MatDialogModule } from "@angular/material/dialog";
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
import { LayoutService } from "./layout.service";
import { SharedModule } from "@shared/shared.module";
import { TableModule } from "@lhacksrt/components/table/table.module";
import { EndorsementListComponent } from "./list/list.component";
import { EndorsementNewComponent } from "./new/new.component";
import { AssignProductComponent } from "./assign-product/assign-product.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { EndorsementSuccessionComponent } from "./endorsement-succession/endorsement-succession.component";

@NgModule({
    declarations: [
        EndorsementListComponent,
        EndorsementNewComponent,
        AssignProductComponent,
        EndorsementSuccessionComponent
    ],

    imports: [
        RouterModule.forChild(routes),
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatTooltipModule,
        MatDialogModule,
        MatDialogContent,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDividerModule,
        ReactiveFormsModule,
        SharedModule,
        TableModule,
        MatProgressSpinnerModule,
        MatCheckboxModule
    ],
    providers: [
        LayoutService
    ],
    exports: [],
})
export class EndorsementsModule { }