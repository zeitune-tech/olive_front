import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Product } from '@core/services/settings/product/product.interface';
import { ProductService } from '@core/services/settings/product/product.service';
import { CommissionTaxService } from '@core/services/settings/commission-tax/commission-tax.service';

@Component({
  selector: 'app-commission-tax-new',
  templateUrl: './new-tax.component.html',
})
export class CommissionTaxNewComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  products: Product[] = [];
  commissionTaxTypes = [
    { value: 'TO_PAY', label: 'À payer' },
    { value: 'TO_WITHHOLD', label: 'À retenir' }
  ];
  message: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _productService: ProductService,
    private _commissionTaxService: CommissionTaxService
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      dateEffective: ['', Validators.required],
      commissionTaxType: [null, Validators.required],
      rate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      pointOfSaleId: [''],
      productId: [null, Validators.required]
    });

    this._productService.products$.subscribe((products) => {
      this.products = products;
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.formGroup.disable();
      const data = this.formGroup.value;

      this._commissionTaxService.create(data).subscribe({
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
