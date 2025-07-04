import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CompanyLevelOrganization } from '@core/services/administration/company-level-organization/company-level-organization.interface';
import { PointOfSale } from '@core/services/administration/point-of-sale/point-of-sale.interface';
import { CompanyLevelOrganizationService } from '@core/services/administration/company-level-organization/company-level-organization.service';
import { CompanyLevelOrganizationAddPointsDialogComponent } from '../add-points/add-points-dialog.component';
import { ConfirmDeleteComponent } from '@shared/components/confirm-delete/confirm-delete.component';

@Component({
    selector: 'app-company-level-organization-points-of-sale',
    templateUrl: './details.component.html'
})
export class CompanyLevelOrganizationPointsOfSaleComponent implements OnInit {

    pointsOfSale: PointOfSale[] = [];
    loading = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: CompanyLevelOrganization,
        private _dialog: MatDialog,
        private _companyOrgService: CompanyLevelOrganizationService
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
        const excludedIds = this.pointsOfSale.map(pos => pos.id);

        const dialogRef = this._dialog.open(CompanyLevelOrganizationAddPointsDialogComponent, {
            width: '600px',
            data: { excludedPointsOfSale: excludedIds },
            disableClose: true,
            autoFocus: false
        });

        dialogRef.afterClosed().subscribe((selected: PointOfSale[] | undefined) => {
            if (selected && selected.length > 0) {
            const pointIds = selected.map(p => p.id);
            this._companyOrgService.addPointsToOrganization(this.data.id, pointIds).subscribe({
                next: () => {
                this.pointsOfSale.push(...selected); // Mise à jour locale
                },
                error: () => {
                // Optionnel : message d'erreur
                }
            });
            }
        });
    }

    onDelete(pos: PointOfSale): void {
        this._dialog.open(ConfirmDeleteComponent, {
            width: '400px',
            data: {
            title: 'form.actions.deleteTitle',
            message: 'entities.point_of_sale.message',
            itemName: pos.name
            }
        }).afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
            this._companyOrgService.removePointOfSale(this.data.id, pos.id).subscribe({
                next: () => {
                this.pointsOfSale = this.pointsOfSale.filter(p => p.id !== pos.id);
                },
                error: () => {
                    this._dialog.open(ConfirmDeleteComponent, {
                        width: '400px',
                        data: {
                            title: 'form.errors.title',
                            message: 'entities.point_of_sale.message_error',
                            isErrorOnly: true
                        }
                    });
                }
            });
            }
        });
    }

}
