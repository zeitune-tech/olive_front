import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TaxService } from '@core/services/settings/tax/tax.service';

@Component({
  selector: 'app-tax-new',
  templateUrl: './new.component.html'
})
export class TaxNewComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  message: string = '';

  // Options for the nature field
  natureOptions = [
    { value: 'TAX_PRIME', label: 'entities.tax.options.nature.TAX_PRIME' },
    { value: 'TAX_ACCESSOIRE', label: 'entities.tax.options.nature.TAX_ACCESSOIRE' },
    { value: 'CARTE_BRUNE', label: 'entities.tax.options.nature.CARTE_BRUNE' },
    { value: 'FGA', label: 'entities.tax.options.nature.FGA' },
    { value: 'OTHER', label: 'entities.tax.options.nature.OTHER' }
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private _taxService: TaxService
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      designation: ['', Validators.required],
      nature: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      this._taxService.create(data).subscribe(() => {
        this.message = 'message.success';
      });
    }
  }
}
