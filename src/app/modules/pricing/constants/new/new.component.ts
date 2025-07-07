import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Product } from '@core/services/settings/product/product.interface';
import { ProductService } from '@core/services/settings/product/product.service';
import { AccessoryService } from '@core/services/settings/accessory/accessory.service';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'pricing-constants-new',
  templateUrl: './new.component.html',
})
export class ConstantsNewComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  message: string = '';

  /**
   *     
   * 
   * 
   */


  actTypes = [
    { value: 'NEW_BUSINESS', label: 'entities.accessory.options.actType.NEW_BUSINESS' },
    { value: 'MODIFICATION', label: 'entities.accessory.options.actType.MODIFICATION' },
    { value: 'SUSPENSION', label: 'entities.accessory.options.actType.SUSPENSION' },
    { value: 'REINSTATEMENT', label: 'entities.accessory.options.actType.REINSTATEMENT' }
  ];

  products: Product[] = [];
  editMode: boolean = false;
  accessoryId: string | null = null;

  constructor(
    private _formBuilder: FormBuilder,
    private _accessoryService: AccessoryService,
    private _productService: ProductService,
    private _layoutService: LayoutService
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

    // this._layoutService.selectedAccessory$.subscribe((accessoire: any) => {
    //   if (accessoire) {
    //     this.editMode = true;
    //     this.accessoryId = accessoire.id;
    //     this.formGroup.patchValue({
    //       dateEffective: accessoire.dateEffective,
    //       actType: accessoire.actType,
    //       accessoryAmount: accessoire.accessoryAmount,
    //       productId: accessoire.product ? accessoire.product.id : null
    //     });
    //   }
    // });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      if (this.editMode && this.accessoryId) {
        this._accessoryService.update(this.accessoryId, data).subscribe({
          next: () => {
            this.message = 'message.success';
            // this._layoutService.clearSelectedAccessory();
          },
          error: (error) => {
            this.message = 'message.error';
            console.error(error);
          }
        });
      } else if (this.editMode && !this.accessoryId) {
        this.message = 'message.error';
        console.error('Accessory ID is required for update operation.');
      } else {
        this._accessoryService.create(data).subscribe({
          next: () => {
            this.message = 'message.success';
          },
          error: (error) => {
            this.message = 'message.error';
            console.error(error);
          }
        });
      }
    }
  }
}
