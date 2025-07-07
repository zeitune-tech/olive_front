import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./mono.routing";
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
import { MatStepperModule } from "@angular/material/stepper";
import { MatRadioModule } from "@angular/material/radio";
import { NewBusinessComponent } from "./new-business/form/new-business.component";
import { ProducerFormComponent } from "./new-business/producer/producer.component";
import { PolicyFormComponent } from "./new-business/policy/policy.component";
import { AdvancedOptionsComponent } from "./new-business/advanced/advanced.component";
import { RiskComponent } from "./new-business/risk/risk.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { VehicleAttributesComponent } from "./new-business/extra/extra.component";
import { VehicleCoveragesComponent } from "./new-business/coverages/coverage.component";

@NgModule({
    declarations: [

        NewBusinessComponent,
        ProducerFormComponent,
        PolicyFormComponent,
        AdvancedOptionsComponent,
        RiskComponent,
        VehicleAttributesComponent,
        VehicleCoveragesComponent
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
        MatStepperModule,
        MatRadioModule,
        MatCheckboxModule
    ],
    providers: [],
    exports: [],
})
export class MonoModule { }