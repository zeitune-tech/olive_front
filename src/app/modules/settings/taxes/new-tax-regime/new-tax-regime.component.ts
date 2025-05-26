import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TaxService } from '@core/services/settings/tax/tax.service';
import { TaxRegimeService } from '@core/services/settings/tax-regime/tax-regime.service';
import { Tax } from '@core/services/settings/tax/tax.interface';

@Component({
  selector: 'app-tax-regime-new',
  templateUrl: './new-tax-regime.component.html'
})
export class TaxRegimeNewComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  message: string = '';

  taxes: Tax[] = [];

  regimeNatureOptions = [
    { value: 'EXCEPTIONAL', label: 'entities.tax_regime.options.nature.EXCEPTIONAL' },
    { value: 'NORMAL', label: 'entities.tax_regime.options.nature.NORMAL' },
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private _taxService: TaxService,
    private _taxRegimeService: TaxRegimeService
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      designation: ['', Validators.required],
      nature: [null, Validators.required],
      stampExemption: [false],
      exemptedTaxIds: [[]],
    });

    this._taxService.taxes$.subscribe((taxes) => {
      this.taxes = taxes;
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.formGroup.disable();
      const data = this.formGroup.value;

      this._taxRegimeService.create(data).subscribe({
        next: () => {
          this.message = 'form.success.created';
          this.formGroup.reset();
        },
        error: () => {
          this.message = 'form.errors.unexpected';
        },
        complete: () => {
          this.formGroup.enable();
        }
      });
    }
  }
}
