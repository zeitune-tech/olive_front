import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'advanced-options-form',
  templateUrl: './advanced.component.html',
})
export class AdvancedOptionsComponent implements OnInit {
  form!: FormGroup;

  @Output() next = new EventEmitter<FormGroup>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tariff: this.fb.group({
        type: [''],
        label: ['']
      }),
      commission: this.fb.group({
        apport: [''],
        gestion: [''],
        main: [''],
        sub: ['']
      }),
      bonusMalus: this.fb.group({
        regime: [''],
        coefficient: ['1.00']
      }),
      discount: this.fb.group({
        label: [''],
        amount: ['']
      }),
      accessory: this.fb.group({
        amount: ['']
      }),
      stamp: this.fb.group({
        type: [''],
        quantity: ['1'],
        value: [''],
        cpTg: ['']
      }),
      taxExemption: this.fb.group({
        code: [''],
        label: ['']
      })
    });
  }

  goNext(): void {
    this.next.emit(this.form);
  }
}
