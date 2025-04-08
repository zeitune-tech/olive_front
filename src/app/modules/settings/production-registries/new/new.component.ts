import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { Product } from "@core/services/administration/product/product.interface";
import { ProductService } from "@core/services/administration/product/product.service";
import { ProductionRegistryService } from "@core/services/settings/production-registry/production-registry.service";

@Component({
    selector: "app-production-registry-new",
    templateUrl: "./new.component.html",
})
export class ProductionRegistryNewComponent implements OnInit {

    formGroup!: UntypedFormGroup;
    message: string = '';

    products: Product[] = [];

    constructor(
        private _formBuilder: FormBuilder,
        private _productionRegistryService: ProductionRegistryService,
        private _productService: ProductService,
    ) {

        this._productService.products$.subscribe((products) => {
            this.products = products;
        });
    }


    ngOnInit(): void {
        this.formGroup = this._formBuilder.group({
            prefix: ['', Validators.required],
            length: [1, [Validators.required, Validators.min(1)]],
            productId: ['', Validators.required],
        });
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this._productionRegistryService.create(this.formGroup.value).subscribe();
            this._productionRegistryService.getAll().subscribe();
        }
    }

}