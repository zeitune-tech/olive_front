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
        { value: 'FIXED', label: 'Fixed' },
        { value: 'FLEXIBLE', label: 'Flexible' }
      ];
      

    constructor(
        private _formBuilder: FormBuilder,
        private _coverageService: CoverageDurationService,
    ) {}


    ngOnInit(): void {
        this.formGroup = this._formBuilder.group({
            from: [null, [Validators.required, this.pastOrPresentValidator()]],
            to: [null, [Validators.required, this.futureOrPresentValidator()]],
            type: [null, Validators.required],
            prorotaMode: ['', Validators.required],
            unit: ['', Validators.required],
          });
          
    }

    pastOrPresentValidator(): ValidatorFn {
        return (control: AbstractControl) => {
          const date = control.value;
          return date && new Date(date) > new Date() ? { pastOrPresent: true } : null;
        };
      }
      
      futureOrPresentValidator(): ValidatorFn {
        return (control: AbstractControl) => {
          const date = control.value;
          return date && new Date(date) < new Date() ? { futureOrPresent: true } : null;
        };
      }
      

    onSubmit(): void {
        if (this.formGroup.valid) {
            this._coverageService.create(this.formGroup.value).subscribe();
        }
    }

}