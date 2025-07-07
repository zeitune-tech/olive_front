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
import { CoverageReferenceListComponent } from "./list-references/list.component";
import { CoveragesListComponent } from "./list-coverages/list.component";
import { IncompatibleCoveragesListComponent } from "./list-incompatibilities/list.component";
import { CoveragesEditDialogComponent } from "./new-coverage/edit.component";
import { IncompatibleCoveragesNewComponent } from "./new-incompatibility/new.component";
import { CoverageReferenceNewComponent } from "./new-reference/new.component";
import { SelectProductComponent } from "./select-product/select-product.component";
import { CoverageLayoutComponent } from "./layout/layout.component";
import { LayoutService } from "./layout.service";
import { AlertModule } from "@lhacksrt/components";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { CoverageReferenceEditComponent } from "./edit-reference/edit.component";
import { CoveragesFormComponent } from "./coverages-form/coverages-form.component";
import { MatCheckboxModule } from "@angular/material/checkbox";

@NgModule({
    declarations: [
        CoverageReferenceListComponent,
        CoveragesListComponent,
        IncompatibleCoveragesListComponent,
        CoveragesEditDialogComponent,
        IncompatibleCoveragesNewComponent,
        CoverageReferenceNewComponent,
        SelectProductComponent,
        CoverageLayoutComponent,
        CoverageReferenceEditComponent,
        CoveragesFormComponent
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
        MatSnackBarModule,
        MatCheckboxModule
    ],
    providers: [
        LayoutService
    ],
    exports: [],
})
export class CoveragesModule { }