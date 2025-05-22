import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Product } from '@core/services/administration/product/product.interface';
import { ProductService } from '@core/services/administration/product/product.service';
import { Contributor } from '@core/services/settings/commission-contributor/commission-contributor.interface';
import { CommissionContributorService } from '@core/services/settings/commission-contributor/commission-contributor.service';

@Component({
  selector: 'app-commission-contributor-new',
  templateUrl: './new-contributor.component.html',
})
export class CommissionContributorNewComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  products: Product[] = [];
  contributors: Contributor[] = [];
  message: string = '';

  
  calculationBaseOptions = [
    { value: 'PRIME', label: 'Sur la prime' },
    { value: 'ACCESSORY', label: 'Sur les accessoires' },
    { value: 'GARANTIE', label: 'Sur la garantie' }
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private _productService: ProductService,
    private _commissionContributorService: CommissionContributorService
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      dateEffective: ['', Validators.required],
      commissionBase: ['', Validators.required],
      contributorRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      upperEntityContributorRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      contributorId: [''],
      productId: [null, Validators.required],
    });

    this._productService.products$.subscribe((products) => {
      this.products = products;
    });
  }

  
onSubmit(): void {
      console.log(this.formGroup.value, "first");
    if (this.formGroup.valid) {
      console.log(this.formGroup.value);
      this.formGroup.disable();
      const data = this.formGroup.value;

      this._commissionContributorService.create(data).subscribe({
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
