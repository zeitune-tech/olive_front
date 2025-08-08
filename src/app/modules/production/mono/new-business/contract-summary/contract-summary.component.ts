import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'contract-summary',
  templateUrl: './contract-summary.component.html',
})
export class ContractSummaryComponent {
  @Input() formStepOne!: UntypedFormGroup;
  @Input() formStepTwo!: UntypedFormGroup;
  @Input() formStepThree!: UntypedFormGroup;
  @Input() formStepFour!: UntypedFormGroup;
  @Input() formStepFive!: UntypedFormGroup;
}
