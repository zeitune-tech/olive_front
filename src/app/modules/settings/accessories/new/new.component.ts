import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Product } from '@core/services/settings/product/product.interface';
import { ProductService } from '@core/services/settings/product/product.service';
import { AccessoryService } from '@core/services/settings/accessory/accessory.service';
import { LayoutService } from '../layout.service';
import { Endorsment } from '@core/services/settings/endorsement/endorsement.interface';
import { EndorsementService } from '@core/services/settings/endorsement/endorsement.service';

@Component({
  selector: 'app-accessory-new',
  templateUrl: './new.component.html'
})
export class AccessoryNewComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  message: string = '';

  /**
   *     
   * 
   * 
   */

  accessoryTypes = [
    { value: 'RISQUES', label: 'entities.accessory.options.accessoryType.RISQUES' },
    { value: 'POLICE', label: 'entities.accessory.options.accessoryType.POLICE' },
  ];

  endorsements: Endorsment[] = [];
  products: Product[] = [];
  editMode: boolean = false;
  accessoryId: string | null = null;

  constructor(
    private _formBuilder: FormBuilder,
    private _accessoryService: AccessoryService,
    private _productService: ProductService,
    private _layoutService: LayoutService,
    private _endorsementService: EndorsementService
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      dateEffective: [null, Validators.required],
      actType: [null, Validators.required],
      accessoryType: [null, Validators.required],
      accessoryAmount: [null, Validators.required],
      productId: [null, Validators.required],
    });


    this._productService.products$.subscribe((products: Product[]) => {
      this.products = products;
    });

    this._endorsementService.endorsements$.subscribe((endorsements: Endorsment[]) => {
      this.endorsements = endorsements;
    });

    this._layoutService.selectedAccessory$.subscribe((accessoire: any) => {
      if (accessoire) {
        this.editMode = true;
        this.accessoryId = accessoire.id;
        this.formGroup.patchValue({
          dateEffective: accessoire.dateEffective,
          actType: accessoire.endorsement ? accessoire.endorsement.id : null,
          accessoryType: accessoire.accessoryType,
          accessoryAmount: accessoire.accessoryAmount,
          productId: accessoire.product ? accessoire.product.id : null
        });
      }
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      if (this.editMode && this.accessoryId) {
        this._accessoryService.update(this.accessoryId, data).subscribe({
          next: () => {
            this.message = 'message.success';
            this._layoutService.clearSelectedAccessory();
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
