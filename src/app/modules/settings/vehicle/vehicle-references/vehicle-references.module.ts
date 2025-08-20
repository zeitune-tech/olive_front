import {NgModule} from "@angular/core";
import {SharedModule} from "@shared/shared.module";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {RouterModule} from "@angular/router";
import {routes} from "./vehicle-references.routing";
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
import {MatCheckboxModule} from "@angular/material/checkbox";
import {VehicleBrandListComponent} from "./vehicle-brand/list/list.component";
import {VehicleBrandFormComponent} from "./vehicle-brand/form/form.component";
import {VehicleBrandService} from "@core/services/settings/vehicle/referential/brand/vehicle-brand.service";
import {VehicleDTTReferentialListComponent} from "./vehicle-dtt-referential/list/list.component";
import {VehicleDTTReferentialFormComponent} from "./vehicle-dtt-referential/form/form.component";
import {
  VehicleDTTReferentialService
} from "@core/services/settings/vehicle/referential/dtt/vehicle-dtt-referential.service";
import {VehicleModelListComponent} from "./vehicle-model/list/list.component";
import {VehicleModelFormComponent} from "./vehicle-model/form/form.component";
import {VehicleModelService} from "@core/services/settings/vehicle/referential/model/vehicle-model.service";

@NgModule({
  declarations: [
    VehicleBrandListComponent,
    VehicleBrandFormComponent,
    VehicleDTTReferentialListComponent,
    VehicleDTTReferentialFormComponent,
    VehicleModelListComponent,
    VehicleModelFormComponent
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
    VehicleBrandService,
    VehicleModelService,
    VehicleDTTReferentialService,
  ]
})
export class VehicleReferencesModule {
  constructor() {
    // Module initialization logic can go here
  }
}
