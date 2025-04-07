import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { CoverageReferentialService } from "@core/services/settings/coverage-referential/coverage-referential.service";

@Component({
    selector: "app-coverage-referentials-new",
    templateUrl: "./new.component.html",
})
export class CoverageReferentialsNewComponent implements OnInit {

    formGroup!: UntypedFormGroup;
    message: string = '';

    constructor(
        private _formBuilder: FormBuilder,
        private _coverageReferentialService: CoverageReferentialService,
    ) {}


    ngOnInit(): void {
        this.formGroup = this._formBuilder.group({
            designation: ['', Validators.required],
            family: ['', Validators.required],
            accessCharacteristic: [null, Validators.required],
            tariffAccess: [null, Validators.required],
            managementEntity: [null, Validators.required]
          });
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            // this._coverage-referentialService.create(this.form.value).subscribe();
        }
    }

}