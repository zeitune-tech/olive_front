import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'risk-form',
  templateUrl: './risk.component.html',
})
export class RiskComponent implements OnInit {
  form!: FormGroup;

  @Output() next = new EventEmitter<FormGroup>();

  constructor(private fb: FormBuilder) {}

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
  }

  goNext(): void {
    this.next.emit(this.form);
  }
}
