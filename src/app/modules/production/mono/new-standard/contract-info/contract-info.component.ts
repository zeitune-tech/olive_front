import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'contract-info',
  templateUrl: './contract-info.component.html'
})
export class ContractInfoComponent implements OnInit {
  form!: UntypedFormGroup;

  @Output() formReady = new EventEmitter<UntypedFormGroup>();

  constructor(private _formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      contractNumber: [null, Validators.required],
      contractType: [null, Validators.required],
      status: ['ACTIF'],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      durationMonths: [12, [Validators.required, Validators.min(1)]],
      agencyCode: [null],
      agencyName: [null],
      agencyLocation: [null]
    });

    this.formReady.emit(this.form);
  }
}
