import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Product } from '@core/services/settings/product/product.interface';
import { ProductService } from '@core/services/settings/product/product.service';
import { TaxService } from '@core/services/settings/tax/tax.service';

@Component({
  selector: 'app-tax-new',
  templateUrl: './new.component.html'
})
export class TaxNewComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  products: Product[] = [];
  message: string = '';

  /**
   * [RGR5, RGR1, RGR2, RGR3, RGR4]
   */

  rgrOptions = [
    { value: 'RGR1', label: 'RGR1' },
    { value: 'RGR2', label: 'RGR2' },
    { value: 'RGR3', label: 'RGR3' },
    { value: 'RGR4', label: 'RGR4' },
    { value: 'RGR5', label: 'RGR5' }
  ];

    /**
     * [OTHER, TAX, FGA]
     */
  natureOptions = [
    { value: 'OTHER', label: 'OTHER' },
    { value: 'TAX', label: 'TAX' },
    { value: 'FGA', label: 'FGA' }
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private _productService: ProductService,
    private _taxService: TaxService
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      designation: ['', Validators.required],
      rgr: [null, Validators.required],
      nature: [null, Validators.required],
    });

    this._productService.products$.subscribe((products) => {
      this.products = products;
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      this._taxService.create(data).subscribe(() => {
        this.message = 'form.success.created';
      });
    }
  }
}
