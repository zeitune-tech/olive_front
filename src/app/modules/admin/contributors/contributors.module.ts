import { NgModule } from "@angular/core";
import { ContributorsListComponent } from "./list/list.component";
import { RouterModule } from "@angular/router";
import { routes } from "./contributors.routing";
import { ContributorNewComponent } from "./new/new.component";
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
import { ContributorFormComponent } from "./edit/edit.component";
import { ContributorsTypeListComponent } from "./contributor-type/list.component";
import { ContributorTypeFormComponent } from "./contributor-type-form/form.component";
import { AccountComponent } from "./account/account.component";

@NgModule({
    declarations: [
        ContributorsListComponent,
        ContributorNewComponent,
        ContributorFormComponent,
        ContributorsTypeListComponent,
        ContributorTypeFormComponent,
        AccountComponent
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
    exports: []
})
export class ContributorsModule { }