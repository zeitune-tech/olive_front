import {NgModule} from "@angular/core";
import {SharedModule} from "@shared/shared.module";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {RouterModule} from "@angular/router";
import {routes} from "./pricing-type.routing";
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
import {LayoutService} from "./layout.service";
import {ConstantService} from "@core/services/pricing/constant/constant.service";
import {PricingSharedModule} from "../shared/pricing-shared.module";
import {PricingTypeFormComponent} from "./form/form.component";
import {PricingTypeListComponent} from "./list/list.component";
import {PricingTypeService} from "@core/services/pricing/pricing-type/pricing-type.service";

@NgModule({
  declarations: [
    PricingTypeListComponent,
    PricingTypeFormComponent,
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
    PricingSharedModule

  ],
  exports: [],
  providers: [
    LayoutService,
    PricingTypeService
  ]
})
export class PricingTypeModule {
  constructor() {
    // Module initialization logic can go here
  }
}
