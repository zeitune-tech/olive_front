import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Insured } from '@core/services/insured/insured/insured.interface';
import { InsuredService } from '@core/services/insured/insured/insured.service';

@Component({
  selector: 'insured-selector',
  templateUrl: './insured-selector.component.html'
})
export class InsuredSelectorComponent implements OnInit {
  form!: UntypedFormGroup;

  @Output() formReady = new EventEmitter<UntypedFormGroup>();

  insureds: Insured[] = [];

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _insuredService: InsuredService
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      insuredUuid: [null, Validators.required]
    });

    this._insuredService.getAll().subscribe((list) => {
      this.insureds = list;
    });

    this.formReady.emit(this.form);
  }
}
