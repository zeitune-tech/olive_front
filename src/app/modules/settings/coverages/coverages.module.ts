import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./coverages.routing";
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
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CoverageReferentialsListComponent } from "./list-referentials/list.component";
import { CoveragesListComponent } from "./list-coverages/list.component";
import { IncompatibleCoveragesListComponent } from "./list-incompatibilities/list.component";
import { CoveragesNewComponent } from "./new-coverage/new.component";
import { IncompatibleCoveragesNewComponent } from "./new-incompatibility/new.component";
import { CoverageReferentialsNewComponent } from "./new-referential/new.component";

@NgModule({
    declarations: [
        CoverageReferentialsListComponent,
        CoveragesListComponent,
        IncompatibleCoveragesListComponent,
        CoveragesNewComponent,
        IncompatibleCoveragesNewComponent,
        CoverageReferentialsNewComponent
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
        MatProgressSpinnerModule
    ],
    providers: [],
    exports: [],
})
export class CoveragesModule { }