import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ProductService } from '@core/services/settings/product/product.service';
import { TaxService } from '@core/services/settings/tax/tax.service';
import { BaseTaxService } from '@core/services/settings/base-tax/base-tax.service';
import { Product } from '@core/services/settings/product/product.interface';
import { Tax } from '@core/services/settings/tax/tax.interface';
import { PointOfSale } from '@core/services/administration/point-of-sale/point-of-sale.interface';
import { CoverageService } from '@core/services/settings/coverage/coverage.service';
import { Coverage } from '@core/services/settings/coverage/coverage.interface';

@Component({
  selector: 'app-base-tax-new',
  templateUrl: './new-base-tax.component.html'
})
export class BaseTaxNewComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  products: Product[] = [];
  taxes: Tax[] = [];
  coverages: Coverage[] = [];
  pointsOfSale: PointOfSale[] = [];

  calculationBaseOptions = [
    { value: 'PRIME', label: 'entities.base_tax.options.calculationBase.PRIME' },
    { value: 'ACCESSORY', label: 'entities.base_tax.options.calculationBase.ACCESSORY' },
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private _productService: ProductService,
    private _taxService: TaxService,
    private _coverageService: CoverageService,
    private _baseTaxService: BaseTaxService
  ) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      dateEffective: [null, Validators.required],
      calculationBase: [{ value: 'PRIME', disabled: true }, Validators.required],
      isFlat: [false, Validators.required],
      rate: [0],
      fixedAmount: [0],
      taxId: [null, Validators.required],
      coverageId: [null],
      productId: [null, Validators.required]
    });

    this._productService.products$.subscribe(p => this.products = p);
    this._taxService.taxes$.subscribe(t => this.taxes = t);
    let allCoverages: Coverage[] = [];

    this._coverageService.coverages$.subscribe(c => {
      allCoverages = c;

      this.formGroup.get('productId')?.valueChanges.subscribe(productId => {
        this.coverages = allCoverages.filter(cov => cov.product.id === productId);
        this.formGroup.get('coverageId')?.setValue(null); // réinitialise le champ si la couverture devient invalide
      });
    });


    // 💡 Mise à jour de l'affichage des champs selon isFlat
    this.formGroup.get('isFlat')?.valueChanges.subscribe((isFlat: boolean) => {
      if (isFlat) {
        this.formGroup.get('rate')?.disable();
        this.formGroup.get('fixedAmount')?.enable();
      } else {
        this.formGroup.get('fixedAmount')?.disable();
        this.formGroup.get('rate')?.enable();
      }
    });

    // Appliquer l'état initial
    const initialIsFlat = this.formGroup.get('isFlat')?.value;
    if (initialIsFlat) {
      this.formGroup.get('rate')?.disable();
    } else {
      this.formGroup.get('fixedAmount')?.disable();
    }
  }


  onCancel(): void {
    this.formGroup.reset();
    // ou navigate si besoin : this.router.navigate(['/base-taxes']);
  }


  onSubmit(): void {
    if (this.formGroup.valid) {
      const data = this.formGroup.getRawValue();
      this._baseTaxService.create(data).subscribe(() => {
        console.log('Base de taxe créée');
        this.formGroup.reset();
      });
    }
  }
}
