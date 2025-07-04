import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MarketLevelOrganization } from '@core/services/administration/market-level-organization/market-level-organization.interface';
import { Company } from '@core/services/administration/company/company.interface';
import { MarketLevelOrganizationService } from '@core/services/administration/market-level-organization/market-level-organization.service';
import { ManagementEntity } from '@core/services/administration/management-entity/management-entity.interface';
import { Product } from '@core/services/settings/product/product.interface';

@Component({
    selector: "app-market-level-organization-details",
    templateUrl: "./details.component.html",
})
export class MarketLevelOrganizationDetailsComponent implements OnInit {

    organization: MarketLevelOrganization;
    companies: ManagementEntity[] = [];
    products: any[] = [];
    loading = true;

    constructor(
    @Inject(MAT_DIALOG_DATA) public data: MarketLevelOrganization,
    private _marketLevelService: MarketLevelOrganizationService
    ) {
    this.organization = data;
    }

    ngOnInit(): void {
        // this._marketLevelService.getCompanies(this.organization.id).subscribe({
        //     next: (companies) => {
        //     this.companies = companies;
        //     this.loading = false;
        //     },
        //     error: () => {
        //     this.loading = false;
        //     this.companies = [];
        //     }
        // });
        // ✅ Données fictives pour test visuel
        setTimeout(() => {
        this.companies = [
            {
                id: '1',
                code: 'C001',
                name: 'Amsa Assurance',
                email: 'amsa@gmail.com',
                phone: '+221 77 123 45 67',
                address: 'Dakar, Sénégal',
                logo: 'https://via.placeholder.com/80',
                type: 'COMPANY',
                superiorEntity: undefined
            },
            {
                id: '2',
                code: 'C002',
                name: 'AXA Assurance',
                email: 'axa@gmail.com',
                phone: '+221 78 987 65 43',
                address: 'Thiès',
                logo: 'https://via.placeholder.com/80',
                type: 'COMPANY',
                superiorEntity: undefined
            }
        ];
        this.products = [
            {
                id: '1',
                name: 'TPV',
                description: 'Transports Publics de Voyageurs',
            }
        ];
        this.loading = false;
        }, 800); // Petit délai simulé pour l'effet de chargement
    }
}
        
