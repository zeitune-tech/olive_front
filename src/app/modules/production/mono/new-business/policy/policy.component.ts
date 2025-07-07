import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'policy-form',
  templateUrl: './policy.component.html',
})
export class PolicyFormComponent implements OnInit {
  form!: FormGroup;

  @Output() next = new EventEmitter<FormGroup>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [''],
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      idType: [''],
      idNumber: [''],
      birthDate: [null],
      address: [''],
      city: [''],
      socioProfessionalGroup: [''],
      profession: [''],
      activity: [''],
      email: ['', [Validators.email]],
      phone: [''],
      mobile: ['']
    });
  }

  goNext(): void {
    if (this.form.valid) {
      this.next.emit(this.form);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
