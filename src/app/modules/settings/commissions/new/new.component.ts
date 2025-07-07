import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ProductService } from '@core/services/settings/product/product.service';
import { PointOfSaleService } from '@core/services/administration/point-of-sale/point-of-sale.service';
import { CommissionService } from '@core/services/settings/commission/commission.service';

@Component({
  selector: 'app-commission-new',
  templateUrl: './new.component.html'
})
export class CommissionNewComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  message: string = '';

  products: any[] = [];
  pointsOfSale: any[] = [];

  calculationBaseOptions = [
    { value: 'PRIME', label: 'entities.commission.options.calculationBase.PRIME' },
    { value: 'ACCESSORY', label: 'entities.commission.options.calculationBase.ACCESSORY' }
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private _productService: ProductService,
    private _pointOfSaleService: PointOfSaleService,
    private _commissionService: CommissionService
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      dateEffective: [null, Validators.required],
      calculationBase: [null, Validators.required],
      managementRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      contributionRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      salesPointId: [null],
      productId: [null, Validators.required]
    });

    this._productService.products$.subscribe(p => this.products = p);
    this._pointOfSaleService.pointsOfSale$.subscribe(p => this.pointsOfSale = p);
  }

  onSubmit(): void {
      console.log(this.formGroup.value, "first");
    if (this.formGroup.valid) {
      console.log(this.formGroup.value);
      this.formGroup.disable();
      const data = this.formGroup.value;

      this._commissionService.create(data).subscribe({
        next: () => {
          this.message = 'form.success.created';
          this.formGroup.reset();
        },
        error: () => {
          this.message = 'form.errors.unexpected';
        },
        complete: () => this.formGroup.enable()
      });
    }
  }
}
