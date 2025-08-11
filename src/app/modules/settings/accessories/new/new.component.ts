import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  formGroup!: FormGroup;
  message: string = '';

  endorsements: Endorsment[] = [];
  products: Product[] = [];
  selectedProductId: string | null = null;
  filteredEndorsements: Endorsment[] = [];
  editMode: boolean = false;
  accessoryId: string | null = null;
  isFormReady: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _accessoryService: AccessoryService,
    private _productService: ProductService,
    private _layoutService: LayoutService,
    private _endorsementService: EndorsementService
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      dateEffective: [null],
      actType: [null, [Validators.required]],
      accessoryRisk: [null],
      accessoryAmount: [null],
      productId: [null, [Validators.required]],
      day: [new Date(), [Validators.required]],
      hour: [0, [Validators.required, Validators.min(0), Validators.max(23)]],
      minute: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
    });

    this.isFormReady = true;

    this._productService.products$.subscribe((products: Product[]) => {
      this.products = products;
    });

    this._endorsementService.endorsements$.subscribe((endorsements: Endorsment[]) => {
      this.endorsements = endorsements;
      this.filterEndorsements();
    });

    this._layoutService.selectedAccessory$.subscribe((accessoire: any) => {
      if (accessoire) {
        this.editMode = true;
        this.accessoryId = accessoire.id;

        const patch: any = {
          dateEffective: accessoire.dateEffective,
          actType: accessoire.endorsement ? accessoire.endorsement.id : null,
          accessoryRisk: accessoire.accessoryRisk,
          accessoryAmount: accessoire.accessoryAmount,
          productId: accessoire.product ? accessoire.product.id : null,
        };

        if (accessoire.effectiveDate) {
          const date = new Date(accessoire.effectiveDate);
          patch.day = date;
          patch.hour = date.getHours();
          patch.minute = date.getMinutes();
        }

        this.formGroup.patchValue(patch);
      }
    });
  }

  filterEndorsements(): void {
    if (this.selectedProductId != null) {
      this.filteredEndorsements = this.endorsements.filter(e =>
        e.product?.some(p => p.id === this.selectedProductId)
      );
    } else {
      this.filteredEndorsements = [];
    }
  }

  onProductSelected(productId: string): void {
    this.selectedProductId = productId;
    this.filterEndorsements();
  }

  trackById(index: number, item: { id: string }) {
    return item.id;
  }

  onSubmit(): void {
    if (!this.formGroup.valid) {
      console.warn('Formulaire invalide');
      this.message = 'message.invalid';
      return;
    }

    const formValues = this.formGroup.value;
    const date: Date = new Date(formValues.day);
    date.setHours(formValues.hour);
    date.setMinutes(formValues.minute);

    const data = {
      ...formValues,
      effectiveDate: date
    };

    delete data.day;
    delete data.hour;
    delete data.minute;

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
    } else if (!this.editMode) {
      this._accessoryService.create(data).subscribe({
        next: () => {
          this.message = 'message.success';
        },
        error: (error) => {
          this.message = 'message.error';
          console.error(error);
        }
      });
    } else {
      this.message = 'message.error';
      console.error('Accessory ID is requis pour mise à jour');
    }
  }
}
