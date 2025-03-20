import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './user/user.service';
import { ManagementEntityService } from './management-entity/management-entity.service';
import { CompanyService } from './company/company.service';
import { EntitySuperiorService } from './entity-superior/entity-superior.service';
import { PointOfSaleService } from './point-of-sale/point-of-sale.service';
import { AttestationService } from './attestation/attestation.service';
import { EmployeeService } from './employee/employee.service';
import { InsuredService } from './insured/insured.service';
import { DemandService } from './demand/demand.service';


@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        UserService,
        ManagementEntityService,
        CompanyService,
        EntitySuperiorService,
        PointOfSaleService,
        AttestationService,
        EmployeeService,
        InsuredService,
        DemandService
    ]
})
export class ServicesModule { }