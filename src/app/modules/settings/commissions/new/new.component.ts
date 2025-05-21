import { Component } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommissionService } from '@core/services/settings/commission/commission.service';
import { CommissionContributorService } from '@core/services/settings/commission-contributor/commission-contributor.service';

@Component({
  selector: 'app-commission-stepper',
  templateUrl: './new.component.html',
  styles: `
    

  `
})
export class CommissionNewComponent {
  selectedIndex = 0;
  typeForm!: UntypedFormGroup;
  baseForm!: UntypedFormGroup;
  commissionForm!: UntypedFormGroup;
  contributorForm!: UntypedFormGroup;

  summary: any = {};
  calculationBases = [
    { value: 'PRIME', label: 'Sur la prime' },
    { value: 'ACCESSORY', label: 'Sur les accessoires' },
    { value: 'GARANTIE', label: 'Sur la garantie' }
  ];

  constructor(
    private fb: FormBuilder,
    private commissionService: CommissionService,
    private contributorService: CommissionContributorService
  ) {
    this.typeForm = this.fb.group({
      type: ['COMMISSION', Validators.required]
    });

    this.baseForm = this.fb.group({
      calculationBase: [null, Validators.required]
    });

    this.commissionForm = this.fb.group({
      dateEffective: [null, Validators.required],
      managementRate: [null, Validators.required],
      contributionRate: [null, Validators.required],
      pointOfSale: [null, Validators.required],
      product: [null, Validators.required],
      managementEntity: [null, Validators.required]
    });

    this.contributorForm = this.fb.group({
      dateEffective: [null, Validators.required],
      contributorRate: [null, Validators.required],
      upperEntityContributorRate: [null],
      contributor: [null, Validators.required],
      product: [null, Validators.required],
      managementEntity: [null, Validators.required]
    });
  }

  isCommission(): boolean {
    return this.typeForm.value.type === 'COMMISSION';
  }

  nextStep(form: UntypedFormGroup): void {
    if (form.valid) this.selectedIndex++;
  }

  previousStep(): void {
    this.selectedIndex--;
  }

  save(): void {
    const payload = {
      ...this.baseForm.value,
      ...(this.isCommission() ? this.commissionForm.value : this.contributorForm.value)
    };

    if (this.isCommission()) {
      this.commissionService.create(payload).subscribe();
    } else {
      this.contributorService.create(payload).subscribe();
    }
  }

  setSummary(): void {
    this.summary = {
      ...this.baseForm.value,
      ...(this.isCommission() ? this.commissionForm.value : this.contributorForm.value)
    };
  }
}
