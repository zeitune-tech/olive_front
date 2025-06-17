import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, UntypedFormGroup, ValidatorFn, Validators } from "@angular/forms";
import { MarketLevelOrganizationAttestationsService } from "@core/services/attestations/market-level-organization-attestations/market-level-organization.service";
import { ProductService } from "@core/services/settings/product/product.service";
import { Product } from "@core/services/settings/product/product.interface";

@Component({
    selector:'app-company-attestations-new',
    templateUrl: "./new.component.html",
})
export class CompanyAttestationsNewComponent implements OnInit {

    formGroup!: UntypedFormGroup;
    message: string = '';

    products: Product[] = [];
    selectedProduct: Product | null = null;

    constructor(
        private _formBuilder: FormBuilder,
        private _productService: ProductService,
        private _mloAttestationsService: MarketLevelOrganizationAttestationsService
    ) {}


    ngOnInit(): void {
        this.formGroup = this._formBuilder.group({
            product: [null, [Validators.required]],
            prefix: [null, [Validators.required]],
            quantity: [null, [Validators.required, Validators.min(1)]],
            startDate: [null, [Validators.required]],
            endDate: [null, [Validators.required, this.futureOrPresentValidator()]],
        });

        this._productService.products$.subscribe((products) => {
            this.products = products;
        });
    }

    futureOrPresentValidator(): ValidatorFn {
        return (control: AbstractControl) => {
          const date = control.value;
          return date && new Date(date) < new Date() ? { matDatepickerMin: true } : null;
        };
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this._mloAttestationsService.create(this.formGroup.value).subscribe();
        }
    }

}