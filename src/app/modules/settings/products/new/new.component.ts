import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { Branch } from "@core/services/settings/branch/branch.interface";
import { BranchService } from "@core/services/settings/branch/branch.service";
import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";
import { ManagementEntityService } from "@core/services/administration/management-entity/management-entity.service";
import { ProductService } from "@core/services/settings/product/product.service";
import { LayoutService } from "../layout.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { CoverageService } from "@core/services/settings/coverage/coverage.service";

@Component({
	selector: "app-products-new",
	templateUrl: "./new.component.html",
})
export class ProductsNewComponent implements OnInit {



	formStepOne!: UntypedFormGroup;
	formStepTwo!: UntypedFormGroup;
	formStepThree!: UntypedFormGroup;
	formStepFour!: UntypedFormGroup;
	formStepFive!: UntypedFormGroup;

    selectedIndex: number = 0;

	data: {
		name: string;
		description: string;
		branch: Branch | null;
		minRisk: number;
		maxRisk: number;
		minimumGuaranteeNumber: number;
		fleet: boolean | null;
		hasReduction: boolean | null;
		coverages: {
			id: string;
			designation: string;
			family: string;
		}[];
	} = {
		name: '',
		description: '',
		branch: null,
		minRisk: 1,
		maxRisk: 1,
		minimumGuaranteeNumber: 1,
		fleet: null,
		hasReduction: null,
		coverages: [],
	};

	constructor(
		private _productService: ProductService,
		private _coverageService: CoverageService,
		private _router: Router,
	) { }

	ngOnInit(): void {}

	onStepOneNext(fromGroup: UntypedFormGroup): void {
        this.formStepOne = fromGroup;
        this.data.name = fromGroup.value.name;
        this.data.description = fromGroup.value.description;
		this.data.branch = fromGroup.value.branch;
		this.data.minRisk = fromGroup.value.minRisk;
		this.data.maxRisk = fromGroup.value.maxRisk;
		this.data.minimumGuaranteeNumber = fromGroup.value.minimumGuaranteeNumber;
		this.data.fleet = fromGroup.value.fleet;
		this.data.hasReduction = fromGroup.value.hasReduction;
    }


    onStepTwoNext(fromGroup: UntypedFormGroup): void {
        this.formStepTwo = fromGroup;
        this.data.coverages = fromGroup.value.coverages;
    }

	save(): void {
        this._productService.create({
			...this.data,
			coverages: this.data.coverages.map((coverage) => coverage.id)
		})
        .subscribe({
            next: (_product) => {
                this._productService.getAll().subscribe();
				this._coverageService.getAll().subscribe();
                this._router.navigate(['/parameters/products/list']);
            },
            error: (error) => {

            }
        });
    }
}