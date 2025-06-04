import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, UntypedFormGroup, ValidatorFn, Validators } from "@angular/forms";
import { CoverageDurationService } from "@core/services/settings/coverage-duration/coverage-duration.service";

@Component({
    selector: "app-coverage-duration-new",
    templateUrl: "./new.component.html",
})
export class CoverageDurationNewComponent implements OnInit {

    formGroup!: UntypedFormGroup;
    message: string = '';

    coverageDurationTypes = [
        { value: 'FIXED', label: 'FIXED' },
        { value: 'VARIABLE', label: 'VARIABLE' }
      ];
      
    coverageDurationUnits = [
        { value: 'DAY', label: 'DAY' },
        { value: 'WEEK', label: 'WEEK' },
        { value: 'MONTH', label: 'MONTH' },
        { value: 'YEAR',  label: 'YEAR' }
      ];

    constructor(
        private _formBuilder: FormBuilder,
        private _coverageService: CoverageDurationService,
    ) {}


    ngOnInit(): void {
        this.formGroup = this._formBuilder.group({
            type: [null, Validators.required],
            unit: ['', Validators.required],
            from: [null, [Validators.required, Validators.min(0)]],
            to: [null, [this.inferieurToFromValidator(), Validators.min(0)]],
            designation: ['', Validators.required],
          });
          
    }

      inferieurToFromValidator(): ValidatorFn {
        return (control: AbstractControl) => {
          const value = control.value;
          const from = this.formGroup?.get('from')?.value;
          return value && value < from ? { inferieurToFrom: true } : null;
        };
      }

    onSubmit(): void {
        if (this.formGroup.valid) {
          if (this.formGroup.get('type')?.value === 'FIXED') {
            this.formGroup.get('to')?.setValue(this.formGroup.get('from')?.value);
          }
            this._coverageService.create(this.formGroup.value).subscribe();
        }
    }

}