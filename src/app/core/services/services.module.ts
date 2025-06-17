import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './auth/user/user.service';
import { ManagementEntityService } from './administration/management-entity/management-entity.service';
import { CompanyService } from './administration/company/company.service';
import { PointOfSaleService } from './administration/point-of-sale/point-of-sale.service';
import { MarketLevelOrganizationService } from './administration/market-level-organization/market-level-organization.service';
import { CoverageReferenceService } from './settings/coverage-reference/coverage-reference.service';
import { CoverageService } from './settings/coverage/coverage.service';
import { CoverageDurationService } from './settings/coverage-duration/coverage-duration.service';
import { IncompatibleCoverageService } from './settings/incompatible-coverage/incompatible-coverage.service';
import { ProductionRegistryService } from './settings/production-registry/production-registry.service';
import { InsuredRegistryService } from './settings/insured-registry/insured-registry.service';
import { ClosureService } from './settings/closure/closure.service';
import { BranchService } from './settings/branch/branch.service';


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
        CoverageReferenceService,
        CoverageService,
        CoverageDurationService,
        IncompatibleCoverageService,
        ProductionRegistryService,
        InsuredRegistryService,
        ClosureService,
        BranchService
    ]
})
export class ServicesModule { }