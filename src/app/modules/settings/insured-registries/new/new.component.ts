import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { InsuredRegistryService } from "@core/services/settings/insured-registry/insured-registry.service";

@Component({
    selector: "app-insured-registry-new",
    templateUrl: "./new.component.html",
})
export class InsuredRegistryNewComponent implements OnInit {

    formGroup!: UntypedFormGroup;
    message: string = '';

    constructor(
        private _formBuilder: FormBuilder,
        private _insuredRegistryService: InsuredRegistryService,
    ) {}


    ngOnInit(): void {
        this.formGroup = this._formBuilder.group({
            prefix: ['', Validators.required],
            length: [1, [Validators.required, Validators.min(1)]]
        });
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this._insuredRegistryService.create(this.formGroup.value).subscribe();
            this._insuredRegistryService.getAll().subscribe();
        }
    }

}