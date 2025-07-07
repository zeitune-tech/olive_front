import { NgModule } from "@angular/core";
import { CaracteristicListComponent } from "./list/list.component";
import { RouterModule } from "@angular/router";
import { routes } from "./caracteristics.routing";
import { CaracteristicNewComponent } from "./new/new.component";
import { CaracteristicEditComponent } from "./edit/edit.component";
import { SharedModule } from "@shared/shared.module";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TableModule } from "@lhacksrt/components/table/table.module";
import { LayoutService } from "./layout.service";

@NgModule({
    declarations: [
        CaracteristicListComponent,
        CaracteristicNewComponent,
        CaracteristicEditComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatTooltipModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDividerModule,
        ReactiveFormsModule,
        SharedModule,
        TableModule,
        MatProgressSpinnerModule,
    ],
    exports: [],
    providers: [
        LayoutService
    ]
})
export class CaracteristicsModule {
    constructor() {
        // Module initialization logic can go here
    }
}