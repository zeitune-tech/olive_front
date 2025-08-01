import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
    selector: 'app-new-business',
  templateUrl: './new-business.component.html',
})
export class NewBusinessComponent implements OnInit {

  // Un FormGroup par étape
  formStepOne!: UntypedFormGroup;     // Infos Contrat
  formStepTwo!: UntypedFormGroup;     // Souscripteur / Assuré
  formStepThree!: UntypedFormGroup;   // Véhicule
  formStepFour!: UntypedFormGroup;    // Couverture / Garanties
  formStepFive!: UntypedFormGroup;    // Tarifs / Bonus / Timbres
  formStepSix!: UntypedFormGroup;     // Conducteur
  formStepSeven!: UntypedFormGroup;   // Garanties (détaillées)
  formStepEight!: UntypedFormGroup;   // Quittance

  currentView: 'contract' | 'attestation' = 'contract';
  selectedIndex: number = 0;
  product!: string;

  ngOnInit(): void {}

  // Méthodes pour recevoir les formulaires des composants enfants
  onStepOneNext(form: UntypedFormGroup): void {
    this.formStepOne = form;
    this.product = form.value.product;
    this.selectedIndex = 1;
  }

  onStepTwoNext(form: UntypedFormGroup): void {
    this.formStepTwo = form;
    this.selectedIndex = 2;
  }

  onStepThreeNext(form: UntypedFormGroup): void {
    this.formStepThree = form;
    this.selectedIndex = 3;
  }

  onStepFourNext(form: UntypedFormGroup): void {
    this.formStepFour = form;
    this.selectedIndex = 4;
  }

  onStepFiveNext(form: UntypedFormGroup): void {
    this.formStepFive = form;
    this.selectedIndex = 5;
  }

  onStepSixNext(form: UntypedFormGroup): void {
    this.formStepSix = form;
    this.selectedIndex = 6;
  }

  onStepSevenNext(form: UntypedFormGroup): void {
    this.formStepSeven = form;
    this.selectedIndex = 7;
  }

  onStepEightNext(form: UntypedFormGroup): void {
    this.formStepEight = form;
  }

  submit(): void {
    const contractData = {
      generalInfo: this.formStepOne.value,
      insured: this.formStepTwo.value,
      vehicle: this.formStepThree.value,
      coverage: this.formStepFour.value,
      premium: this.formStepFive.value,
      driver: this.formStepSix.value,
      guarantees: this.formStepSeven.value,
      quittance: this.formStepEight.value,
    };

    console.log('Final contract data:', contractData);
    // Appelle ici ton service d'enregistrement si nécessaire
  }
}
