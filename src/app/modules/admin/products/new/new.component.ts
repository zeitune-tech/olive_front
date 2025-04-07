import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { Branch } from "@core/services/administration/branch/branch.interface";
import { BranchService } from "@core/services/administration/branch/branch.service";
import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";
import { ManagementEntityService } from "@core/services/administration/management-entity/management-entity.service";
import { ProductService } from "@core/services/administration/product/product.service";

@Component({
    selector: "app-products-new",
    templateUrl: "./new.component.html",
})
export class ProductsNewComponent implements OnInit {

    formGroup!: UntypedFormGroup;
    message: string = '';

    branches: Branch[] = [];
    owner: ManagementEntity | null = null;

    constructor(
        private _formBuilder: FormBuilder,
        private _productService: ProductService,
        private _branchService: BranchService,
        private _managementService: ManagementEntityService,
    ) {
        this._branchService.branches$.subscribe((branches) => {
            this.branches = branches;
        });
    }


    ngOnInit(): void {
        this.formGroup = this._formBuilder.group({
            name: ['', Validators.required],
            branchUuid: ['', Validators.required],
            ownerUuid: ['', Validators.required],
            minRisk: [1, [Validators.required, Validators.min(1)]],
            maxRisk: [1, [Validators.required, Validators.min(1)]],
            minimumGuaranteeNumber: [1, [Validators.required, Validators.min(1)]],
            fleet: [null, Validators.required],
            hasReduction: [false]
          });
        this._managementService.entity$.subscribe((owner) => {
            this.owner = owner;
            if (this.owner) {
                this.formGroup.get('ownerUuid')?.setValue(this.owner.id);
            }
        });
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this._productService.create(this.formGroup.value).subscribe();
        }
    }

}