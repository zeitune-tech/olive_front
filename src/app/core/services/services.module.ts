import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './auth/user/user.service';
import { ManagementEntityService } from './administration/management-entity/management-entity.service';
import { CompanyService } from './administration/company/company.service';
import { PointOfSaleService } from './administration/point-of-sale/point-of-sale.service';
import { MarketLevelOrganizationService } from './administration/market-level-organization/market-level-organization.service';
import { CoverageReferentialService } from './settings/coverage-referential/coverage-referential.service';
import { CoverageService } from './settings/coverage/coverage.service';
import { CoverageDurationService } from './settings/coverage-duration/coverage-duration.service';
import { IncompatibleCoverageService } from './settings/incompatible-coverage/incompatible-coverage.service';
import { ProductionRegistryService } from './settings/production-registry/production-registry.service';
import { InsuredRegistryService } from './settings/insured-registry/insured-registry.service';
import { ClosureService } from './settings/closure/closure.service';


@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        UserService,
        ManagementEntityService,
        CompanyService,
        MarketLevelOrganizationService,
        PointOfSaleService,
        CoverageReferentialService,
        CoverageService,
        CoverageDurationService,
        IncompatibleCoverageService,
        ProductionRegistryService,
        InsuredRegistryService,
        ClosureService
    ]
})
export class ServicesModule { }