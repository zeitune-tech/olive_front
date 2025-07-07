import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { UntypedFormGroup, FormBuilder, Validators } from "@angular/forms";
import { Branch } from "@core/services/settings/branch/branch.interface";
import { BranchService } from "@core/services/settings/branch/branch.service";
import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";
import { ManagementEntityService } from "@core/services/administration/management-entity/management-entity.service";
import { Subject } from "rxjs";
import { LayoutService } from "../../layout.service";

@Component({
	selector: "app-product-new-step-one",
	templateUrl: "./step-one.component.html",
})
export class ProductNewStepOneComponent implements OnInit {

	unsubscribeAll: Subject<any> = new Subject<any>();
	@Output() formReady = new EventEmitter<UntypedFormGroup>();


	formGroup!: UntypedFormGroup;
	message: string = '';

	branches: Branch[] = [];
	owner: ManagementEntity | null = null;

	constructor(
		private _formBuilder: FormBuilder,
		private _branchService: BranchService,
		private _layoutService: LayoutService,
	) { 
		this.initForm();
	}

	isEditMode: boolean = false;
	productId: string = '';

	initForm(): void {
		this.formGroup = this._formBuilder.group({
			name: ['', Validators.required],
			description: ['', Validators.required],
			branch: ['', Validators.required],
			minRisk: [1, [Validators.min(1)]],
			maxRisk: [1, [Validators.min(1)]],
			minimumGuaranteeNumber: [1, [Validators.required, Validators.min(1)]],
			fleet: [false, Validators.required],
			hasReduction: [false]
		});
	}


	ngOnInit(): void {
		this.initForm();

		this._branchService.branches$.subscribe(branches => {
			this.branches = branches;
		});

		this._layoutService.selectedProduct$.subscribe(product => {
			if (product) {
				this.isEditMode = true;
				this.productId = product.id;
				this.formGroup.patchValue({
					name: product.name,
					branch: product.branch.id,
					minRisk: product.minRisk,
					maxRisk: product.maxRisk,
					minimumGuaranteeNumber: product.minimumGuaranteeNumber,
					fleet: product.fleet,
					hasReduction: product.hasReduction
				});
			}
		});
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Step one next
	 */
	onNext(): void {
		this.formReady.emit(this.formGroup);
	}
}
