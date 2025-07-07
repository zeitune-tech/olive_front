import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ManagementEntityService } from '@core/services/administration/management-entity/management-entity.service';
import { PointOfSale } from '@core/services/administration/point-of-sale/point-of-sale.interface';
import { PointOfSaleService } from '@core/services/administration/point-of-sale/point-of-sale.service';
import { Product } from '@core/services/settings/product/product.interface';
import { ProductService } from '@core/services/settings/product/product.service';
import { SelectDialogComponent } from '@shared/components/select-dialog/select-dialog.component';
import { title } from 'process';
import { ManagementEntity } from '@core/services/administration/management-entity/management-entity.interface';
import { CompanyService } from '@core/services/administration/company/company.service';

@Component({
    selector: 'producer-form',
    templateUrl: './producer.component.html',
})
export class ProducerFormComponent implements OnInit {
    form!: UntypedFormGroup;
    selectedPointOfSale: any;
    selectedProduct: any;
    pointsOfSale: PointOfSale[] = [];
    products: Product[] = [];
    entity!: ManagementEntity;
    company!: ManagementEntity;

    isCompany: boolean = false;

    @Output() next = new EventEmitter<UntypedFormGroup>();

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private _managementEntityService: ManagementEntityService,
        private _pointOfSaleService: PointOfSaleService,
        private _productService: ProductService,
        private _companyService: CompanyService
    ) { }

    ngOnInit(): void {
        this.form = this.fb.group({
            company: [null, Validators.required],
            pointOfSale: [null, Validators.required],
            reference: [null, Validators.required],
            noteNumber: [null, Validators.required],
            product: [null, Validators.required],
            createdBy: [null, Validators.required],
            createdAt: [new Date(), Validators.required],
            numberOfVehicles: [1, Validators.required],
            typeContract: [null, Validators.required],
            natureContract: [null, Validators.required],
        });
    }

    fetchInitialData(): void {
        this._managementEntityService.entity$.subscribe({
            next: (entity) => {
                if (entity) {
                    this.entity = entity;
                    if (entity.type === 'COMPANY') {
                        this.company = entity;
                        this.isCompany = true;
                        this.form.patchValue({ company: entity.id });
                    } else if (entity.type === 'POINT_OF_SALE') {
                        this.company = entity.superiorEntity || new ManagementEntity({});
                        this.form.patchValue({
                            pointOfSale: entity.id
                        });
                        this.isCompany = false;
                    }
                }
            },
            error: (error) => {
                console.error('Error fetching management entity:', error);
            }
        });

        this._pointOfSaleService.pointsOfSale$.subscribe({
            next: (pointsOfSale) => {
                this.pointsOfSale = pointsOfSale;
                if (pointsOfSale && pointsOfSale.length > 0) {
                    this.form.patchValue({
                        pointOfSale: pointsOfSale[0].id
                    });
                }
            },
            error: (error) => {
                console.error('Error fetching points of sale:', error);
            }
        })

        this._productService.products$.subscribe({
            next: (products) => {
                this.products = products;
                if (products && products.length > 0) {
                    this.form.patchValue({
                        product: products[0].id
                    });
                }
            },
            error: (error) => {
                console.error('Error fetching products:', error);
            }
        })

        this._companyService.myCompany$.subscribe({
            next: (company) => {
                if (company) {
                    this.company = company;
                    this.form.patchValue({ company: company.id });
                }
            },
            error: (error) => {
                console.error('Error fetching company:', error);
            }
        })
    }

    openPointOfSaleDialog(): void {
        const dialogRef = this.dialog.open(SelectDialogComponent, {
            width: '600px',
            data: {
                title: 'Select Point of Sale',
                items: this.pointsOfSale,
                displayField: 'name',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.selectedPointOfSale = result;
                this.form.patchValue({ pointOfSale: result.id });
            }
        });
    }

    openProductDialog(): void {
        const dialogRef = this.dialog.open(SelectDialogComponent, {
            width: '600px',
            data: {
                title: 'Select Product',
                items: this.products,
                displayField: 'name',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.selectedProduct = result;
                this.form.patchValue({ product: result.id });
            }
        });
    }

    goNext(): void {
        if (this.form.valid) {
            this.next.emit(this.form);
        } else {
            this.form.markAllAsTouched();
        }
    }
}
