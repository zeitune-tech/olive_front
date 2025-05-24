import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ProductService } from '@core/services/administration/product/product.service';
import { TaxService } from '@core/services/settings/tax/tax.service';
import { CoverageReferenceService } from '@core/services/settings/coverage-reference/coverage-reference.service';
import { PointOfSaleService } from '@core/services/administration/point-of-sale/point-of-sale.service';
import { BaseTaxService } from '@core/services/settings/base-tax/base-tax.service';
import { Product } from '@core/services/administration/product/product.interface';
import { Tax } from '@core/services/settings/tax/tax.interface';
import { CoverageReference } from '@core/services/settings/coverage-reference/coverage-reference.interface';
import { PointOfSale } from '@core/services/administration/point-of-sale/point-of-sale.interface';

@Component({
  selector: 'app-base-tax-new',
  templateUrl: './new-base-tax.component.html'
})
export class BaseTaxNewComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  products: Product[] = [];
  taxes: Tax[] = [];
  coverages: CoverageReference[] = [];
  pointsOfSale: PointOfSale[] = [];

  calculationBaseOptions = [
    { value: 'PRIME', label: 'Sur la prime' },
    { value: 'ACCESSORY', label: 'Sur les accessoires' },
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private _productService: ProductService,
    private _taxService: TaxService,
    private _coverageService: CoverageReferenceService,
    private _pointOfSaleService: PointOfSaleService,
    private _baseTaxService: BaseTaxService
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      dateEffective: [null, Validators.required],
      calculationBase: [null, Validators.required],
      isFlat: [false, Validators.required],
      rate: [0],
      fixedAmount: [0],
      taxId: [null, Validators.required],
      coverageId: [null],
      productId: [null, Validators.required]
    });

    this._productService.products$.subscribe(p => this.products = p);
    this._taxService.taxes$.subscribe(t => this.taxes = t);
    this._coverageService.coverageReferences$.subscribe(c => this.coverages = c);
    this._pointOfSaleService.pointsOfSale$.subscribe(pos => this.pointsOfSale = pos);
  }

  onCancel(): void {
  this.formGroup.reset();
  // ou navigate si besoin : this.router.navigate(['/base-taxes']);
}


  onSubmit(): void {
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      this._baseTaxService.create(data).subscribe(() => {
        console.log('Base de taxe créée');
        this.formGroup.reset();
      });
    }
  }
}
