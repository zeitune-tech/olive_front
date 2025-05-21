import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Product } from '@core/services/administration/product/product.interface';
import { ProductService } from '@core/services/administration/product/product.service';
import { AccessoryService } from '@core/services/settings/accessory/accessory.service';

@Component({
  selector: 'app-accessory-new',
  templateUrl: './new.component.html'
})
export class AccessoryNewComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  message: string = '';

  /**
   *     
   * NEW_BUSINESS,
    MODIFICATION,
    SUSPENSION,
    REINSTATEMENT
   */


  actTypes = [
    { value: 'NEW_BUSINESS', label: 'Affaire Nouvelle' },
    { value: 'MODIFICATION', label: 'Modification' },
    { value: 'SUSPENSION', label: 'Suspension' },
    { value: 'REINSTATEMENT', label: 'Réintégration' }
  ];

  products: Product[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _accessoryService: AccessoryService,
    private _productService: ProductService
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      dateEffective: [null, Validators.required],
      actType: [null, Validators.required],
      accessoryAmount: [null, Validators.required],
      productId: [null, Validators.required],
    });


    this._productService.products$.subscribe((products: Product[]) => {
      this.products = products;
    });
  }
  onSubmit(): void {
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      this._accessoryService.create(data).subscribe(() => {
        this.message = 'form.success.created';
      });
    }
  }
}
