import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, UntypedFormGroup, ValidatorFn, Validators } from "@angular/forms";
import { ClosureService } from "@core/services/settings/closure/closure.service";

@Component({
    selector: "app-closures-new",
    templateUrl: "./new.component.html",
})
export class ClosuresNewComponent implements OnInit {

    formGroup!: UntypedFormGroup;
    message: string = '';

    closureTypes = [
        { value: 'CLOSURE_TYPE_1', label: 'Type 1' },
        { value: 'CLOSURE_TYPE_2', label: 'Type 2' },
    ];

    constructor(
        private _formBuilder: FormBuilder,
        private _closureService: ClosureService,
    ) {}


    ngOnInit(): void {
        this.formGroup = this._formBuilder.group({
            type: [null, Validators.required],
            date: [null, [Validators.required, this.pastOrPresentValidator()]],
            managementEntity: [null, Validators.required],
            product: [null, Validators.required]
          });
          
    }

    pastOrPresentValidator(): ValidatorFn {
        return (control: AbstractControl) => {
          const date = control.value;
          return date && new Date(date) > new Date() ? { matDatepickerMax: true } : null;
        };
      }

    onSubmit(): void {
        if (this.formGroup.valid) {
            // this._closureService.create(this.form.value).subscribe();
        }
    }

}