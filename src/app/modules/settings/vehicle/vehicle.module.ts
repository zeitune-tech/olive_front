import {NgModule} from "@angular/core";
import {SharedModule} from "@shared/shared.module";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {RouterModule} from "@angular/router";
import {routes} from "./vehicle.routing";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TableModule} from "@lhacksrt/components/table/table.module";
import {VehicleCategoryListComponent} from "./vehicle-category/list/list.component";
import {VehicleCategoryFormComponent} from "./vehicle-category/form/form.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {VehicleUsageFormComponent} from "./vehicle-usage/form/form.component";
import {VehicleUsageListComponent} from "./vehicle-usage/list/list.component";
import {VehicleCategoryService} from "@core/services/settings/vehicle/category/category.service";
import {VehicleUsageService} from "@core/services/settings/vehicle/usage/usage.service";

@NgModule({
  declarations: [
    VehicleCategoryListComponent,
    VehicleCategoryFormComponent,
    VehicleUsageListComponent,
    VehicleUsageFormComponent,
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
    MatCheckboxModule
  ],
  exports: [],
  providers: [
    VehicleCategoryService,
    VehicleUsageService
  ]
})
export class VehicleModule {
  constructor() {
    // Module initialization logic can go here
  }
}
