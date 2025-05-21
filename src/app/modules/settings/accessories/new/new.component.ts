import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AccessoryService } from '@core/services/settings/accessory/accessory.service';

@Component({
  selector: 'app-accessory-new',
  templateUrl: './new.component.html'
})
export class AccessoryNewComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  message: string = '';

  actTypes = [
    { value: 'INCLUSION', label: 'Inclusion' },
    { value: 'EXCLUSION', label: 'Exclusion' }
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private _accessoryService: AccessoryService
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      dateEffective: [null, Validators.required],
      actType: [null, Validators.required],
      accessoryAmount: [null, Validators.required],
      product: [null, Validators.required],
      managementEntity: [null, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      this._accessoryService.create(data).subscribe(() => {
        this.message = 'form.success.created';
      });
    }
  }
}
