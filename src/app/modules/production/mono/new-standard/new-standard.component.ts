import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Product } from '@core/services/settings/product/product.interface';

@Component({
  selector: 'app-contract-new-standard',
  templateUrl: './new-standard.component.html',
})
export class ContractNewComponent implements OnInit {

  formStepOne!: UntypedFormGroup;  // Contract Info
  formStepTwo!: UntypedFormGroup;  // Insured
  formStepThree!: UntypedFormGroup;  // Vehicle
  formStepFour!: UntypedFormGroup;  // Coverages
  formStepFive!: UntypedFormGroup;  // Premiums
  formStepSix!: UntypedFormGroup;  // Summary

  selectedIndex: number = 0;

  ngOnInit(): void {}

  product!: string;

  onStepOneNext(form: UntypedFormGroup): void {
    this.formStepOne = form;
    this.product = this.formStepOne.value.product; // Assuming product is selected in step one
  }

  onStepTwoNext(form: UntypedFormGroup): void {
    this.formStepTwo = form;
  }

  onStepThreeNext(form: UntypedFormGroup): void {
    this.formStepThree = form;
  }

  onStepFourNext(form: UntypedFormGroup): void {
    this.formStepFour = form;
  }

  onStepFiveNext(form: UntypedFormGroup): void {
    this.formStepFive = form;
  }

  onStepSixNext(form: UntypedFormGroup): void {
    this.formStepSix = form;
  }

  submit(): void {
    const contractData = {
      ...this.formStepOne.value,
      insured: this.formStepTwo.value,
      vehicle: this.formStepThree.value,
      coverages: this.formStepFour.value.coverages,
      premiums: this.formStepFive.value,
    };
    console.log('Final contract data:', contractData);
    // Call service to submit
  }
}
