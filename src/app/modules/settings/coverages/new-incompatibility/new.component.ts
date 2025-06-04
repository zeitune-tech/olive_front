import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { Product } from "@core/services/administration/product/product.interface";
import { ProductService } from "@core/services/administration/product/product.service";
import { Coverage } from "@core/services/settings/coverage/coverage.interface";
import { CoverageService } from "@core/services/settings/coverage/coverage.service";
import { IncompatibleCoverageService } from "@core/services/settings/incompatible-coverage/incompatible-coverage.service";

@Component({
	selector: "app-incompatible-coverages-new",
	templateUrl: "./new.component.html",
})
export class IncompatibleCoveragesNewComponent implements OnInit {

	formGroup!: UntypedFormGroup;
	message: string = '';

	allCoverages: Coverage[] = [];

	products: Product[] = [];
	coverages: Coverage[] = [];
	incompatibles: Coverage[] = [];


	constructor(
		private _formBuilder: FormBuilder,
		private _incompatibleCoverageService: IncompatibleCoverageService,
		private _productService: ProductService,
		private _coverageService: CoverageService,
	) { }

	ngOnInit(): void {
		this.formGroup = this._formBuilder.group({
			productId: [null, Validators.required],
			coverageId: [null, Validators.required],
			incompatibleId: [null, Validators.required],
		});

		this._productService.products$.subscribe((products) => {
			this.products = products;
		});
		this._coverageService.coverages$.subscribe((coverages) => {
			this.coverages = coverages;
			this.incompatibles = coverages;
			this.allCoverages = coverages;
		});

		this.formGroup.get('productId')?.valueChanges.subscribe((productId: string) => {
			if (productId) {
				this.coverages = this.allCoverages.filter((coverage: Coverage) => {
					return coverage.product.id === productId;
				});
				this.incompatibles = this.allCoverages.filter((coverage: Coverage) => {
					return coverage.product.id === productId;
				});
			}
		})
	}

	onSubmit(): void {
		if (this.formGroup.valid) {
			this._incompatibleCoverageService.create(this.formGroup.value).subscribe();
		}
	}
}