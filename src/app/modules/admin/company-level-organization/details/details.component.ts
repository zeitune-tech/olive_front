import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CompanyLevelOrganization } from '@core/services/administration/company-level-organization/company-level-organization.interface';
import { PointOfSale } from '@core/services/administration/point-of-sale/point-of-sale.interface';
import { PointOfSaleService } from '@core/services/administration/point-of-sale/point-of-sale.service';

@Component({
    selector: 'app-company-level-organization-points-of-sale',
    templateUrl: './details.component.html'
})
export class CompanyLevelOrganizationPointsOfSaleComponent implements OnInit {

    pointsOfSale: PointOfSale[] = [];
    loading = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: CompanyLevelOrganization,
    ) {

        this.loadPointsOfSale();
    }

    ngOnInit(): void {
    }

    private loadPointsOfSale(): void {
        this.loading = true;
        this.pointsOfSale = [];
        if (this.data && this.data.id) {
            this.pointsOfSale = this.data.pointsOfSale || [];
            this.loading = false;
        } else {
            this.loading = false;
        }
    }


    onAddPointOfSale(): void {
        // const dialogRef = this.dialog.open(PointOfSaleNewComponent, {
        //     width: '600px',
        //     data: { organizationId: this.organizationId }
        // });

        // dialogRef.afterClosed().subscribe((result) => {
        //     if (result) {
        //         this.loadPointsOfSale();
        //     }
        // });
    }
}
