import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { ProductService } from "@core/services/product/product.service";

@Component({
    selector: "app-products-new",
    templateUrl: "./new.component.html",
})
export class ProductsNewComponent implements OnInit {

    formGroup!: UntypedFormGroup;
    message: string = '';

    constructor(
        private _formBuilder: FormBuilder,
        private _productService: ProductService,
    ) {}


    ngOnInit(): void {
        this.formGroup = this._formBuilder.group({
            name: ['', [Validators.required]],
            description: ['', []],
            category: ['', [Validators.required]],
            branch: ['', [Validators.required]],
        });
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            // this._productService.create(this.form.value).subscribe();
        }
    }

}