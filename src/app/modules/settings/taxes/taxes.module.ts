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

import { MatCheckboxModule } from "@angular/material/checkbox";
import {DimensionStampFormComponent} from "./dimension-stamp/form/form.component";
import {DimensionStampListComponent} from "./dimension-stamp/list/list.component";
import {GraduatedStampFormComponent} from "./graduated-stamp/form/form.component";
import {GraduatedStampListComponent} from "./graduated-stamp/list/list.component";
// import {AccessoriesFormComponent} from "./taxes-accessories/form/form.component";
import {ExemptionFormComponent} from "./taxes-exemption/form/form.component";
import {PrimesFormComponent} from "./taxes-primes/form/form.component";
import {TypeFormComponent} from "./taxes-type/form/form.component";
import {ExemptionListComponent} from "./taxes-exemption/list/list.component";
import {PrimesListComponent} from "./taxes-primes/list/list.component";
import {TypeListComponent} from "./taxes-type/list/list.component";
import {AccessoriesFormComponent} from "./taxes-accessories/form/form.component";
import {AccessoriesListComponent} from "./taxes-accessories/list/list.component";

@NgModule({
    declarations: [
      DimensionStampFormComponent,
      DimensionStampListComponent,
      GraduatedStampFormComponent,
      GraduatedStampListComponent,
      AccessoriesFormComponent,
      AccessoriesListComponent,
      ExemptionFormComponent,
      ExemptionListComponent,
      PrimesFormComponent,
      PrimesListComponent,
      TypeFormComponent,
      TypeListComponent
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
