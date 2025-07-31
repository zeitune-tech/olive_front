import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'risk-form',
  templateUrl: './risk.component.html',
})
export class RiskComponent implements OnInit {
  form!: FormGroup;

  @Output() next = new EventEmitter<FormGroup>();

  constructor(
    private fb: FormBuilder
  ) { }

ngOnInit(): void {
  this.form = this.fb.group({
    orderNumber: ['1'],
    brand: [''],
    modelType: [''],
    category: [''],
    registrationNumber: [''],
    registrationDate: [null],
    energyType: ['Essence'],
    chassisNumber: [''],
    engineNumber: [''],
    bodyType: ['Conduite Intérieure'],
    turbo: [false],
    creditDelivery: [false],
    withTrailer: [false],
    flammableMaterial: [false],
    power: [''],
    payload: [''],
    cylinder: [''],
    seats: [''],
    catalogValue: [''],
    declaredValue: [''],
    certificateNumber: ['']
  });

  // Initialisation à partir de l’attestation
  this.form.patchValue({
    brand: 'PEUGEOT',
    modelType: '307',
    category: 'Véhicule Particulier',
    registrationNumber: 'AA749QS',
    registrationDate: new Date('2024-07-22'),
    energyType: 'Essence',
    power: 6,
    seats: 5,
    bodyType: 'Conduite Intérieure',
    chassisNumber: 'VF3**************', // Exemple fictif
    engineNumber: 'ENG-307-PEU-2024',   // Exemple fictif
    catalogValue: 4000000,
    declaredValue: 3200000,
    certificateNumber: 'CERT-001234'
  });
}


  goNext(): void {
    this.next.emit(this.form);
  }

  loadVehicleDataFromTransport(): void {
    const registration = this.form.get('registrationNumber')?.value;

    if (!registration) {
      // Afficher un message d'erreur si vide
      return;
    }

    // Appeler ton service ici (ex. : directionTransportService.getVehicleInfo(registration))
    // Exemple fictif :
    // this.transportService.getVehicleInfo(registration).subscribe(data => {
    //   this.form.patchValue({
    //     brand: data.brand,
    //     modelType: data.model,
    //     category: data.category,
    //     chassisNumber: data.chassisNumber,
    //     registrationDate: data.registrationDate,
    //     // etc.
    //   });
    // });
  }

}
