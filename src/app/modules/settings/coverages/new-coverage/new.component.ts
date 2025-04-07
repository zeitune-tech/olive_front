import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { CoverageService } from "@core/services/settings/coverage/coverage.service";

@Component({
    selector: "app-coverages-new",
    templateUrl: "./new.component.html",
})
export class CoveragesNewComponent implements OnInit {

    formGroup!: UntypedFormGroup;
    message: string = '';

    calculationModes = [
        { value: 'CALCULATION_MODE_1', label: 'Mode 1' },
        { value: 'CALCULATION_MODE_2', label: 'Mode 2' },
        { value: 'CALCULATION_MODE_3', label: 'Mode 3' },
    ];

    constructor(
        private _formBuilder: FormBuilder,
        private _coverageService: CoverageService,
    ) {}


    ngOnInit(): void {
        this.formGroup = this._formBuilder.group({
            nature: ['', Validators.required],
            isFree: [null, Validators.required],
            isFixed: [null, Validators.required],
            calculationMode: [null, Validators.required],
            fixedCapital: [null, [Validators.min(0.01)]],
            minCapital: [null, [Validators.min(0)]],
            maxCapital: [null, [Validators.min(0)]],
            order: [0, [Validators.min(0)]],
            prorata: ['', Validators.required],
            displayPrime: [null, Validators.required],
            generatesCharacteristic: [null, Validators.required],
            coverageReferenceId: [null, Validators.required],
            product: [null, Validators.required],
            managementEntity: [null, Validators.required]
          });
          
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            // this._coverageService.create(this.form.value).subscribe();
        }
    }

}