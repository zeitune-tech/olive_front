import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { ProductionRegistryService } from "@core/services/settings/production-registry/production-registry.service";

@Component({
    selector: "app-production-registry-new",
    templateUrl: "./new.component.html",
})
export class ProductionRegistryNewComponent implements OnInit {

    formGroup!: UntypedFormGroup;
    message: string = '';

    constructor(
        private _formBuilder: FormBuilder,
        private _productionRegistryService: ProductionRegistryService,
    ) {}


    ngOnInit(): void {
        this.formGroup = this._formBuilder.group({
            prefix: ['', Validators.required],
            length: [1, [Validators.required, Validators.min(1)]],
            managementEntity: [null, Validators.required]
        });
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            // this._production-registryService.create(this.form.value).subscribe();
        }
    }

}