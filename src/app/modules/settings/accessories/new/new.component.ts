import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Product } from '@core/services/settings/product/product.interface';
import { ProductService } from '@core/services/settings/product/product.service';
import { AccessoryService } from '@core/services/settings/accessory/accessory.service';
import { LayoutService } from '../layout.service';
import { Endorsment } from '@core/services/settings/endorsement/endorsement.interface';
import { EndorsementService } from '@core/services/settings/endorsement/endorsement.service';
import { Accessory } from '@core/services/settings/accessory/accessory.interface';

@Component({
  selector: 'app-accessory-new',
  templateUrl: './new.component.html'
})
export class AccessoryNewComponent implements OnInit {
  formGroup!: FormGroup;
  message = '';

  endorsements: Endorsment[] = [];
  products: Product[] = [];
  selectedProductId: string | null = null;
  filteredEndorsements: Endorsment[] = [];
  editMode = false;
  accessoryId: string | null = null;
  isFormReady = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _accessoryService: AccessoryService,
    private _productService: ProductService,
    private _layoutService: LayoutService,
    private _endorsementService: EndorsementService
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      // LocalDate côté back → on stocke des Date JS et on normalise juste avant envoi
      dateEffective: [null, [Validators.required]],
      day: [null, [Validators.required, this.dayNotInPastValidator]],

      // UUIDs
      productId: [null, [Validators.required]],
      actType: [null, [Validators.required]], // UUID de l’Endorsement

      // montants / temps
      accessoryRisk: [null, [Validators.required]],
      accessoryAmount: [null, [Validators.required]],
      hour: [0, [Validators.required, Validators.min(0), Validators.max(23)]],
      minute: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
    });

    this.isFormReady = true;

    this._productService.products$.subscribe((products) => (this.products = products));

    this._endorsementService.endorsements$.subscribe((endorsements) => {
      this.endorsements = endorsements;
      this.filterEndorsements();
    });

    // Mode édition : pré-remplir depuis l’accessoire sélectionné
    this._layoutService.selectedAccessory$.subscribe((accessoire: any) => {
      if (!accessoire) return;

      this.editMode = true;
      this.accessoryId = accessoire.id;

      const patch: any = {
        dateEffective: accessoire.dateEffective ? new Date(accessoire.dateEffective) : null,
        // actType est un Endorsment côté interface -> on prend son id à renvoyer
        actType: accessoire.actType ? accessoire.actType.id : null,
        accessoryRisk: accessoire.accessoryRisk,
        accessoryAmount: accessoire.accessoryAmount,
        productId: accessoire.product ? accessoire.product.id : null,
        day: accessoire.day ? new Date(accessoire.day) : new Date(),
        hour: typeof accessoire.hour === 'number' ? accessoire.hour : 0,
        minute: typeof accessoire.minute === 'number' ? accessoire.minute : 0
      };

      this.formGroup.patchValue(patch);

      // pour filtrer les avenants liés à ce produit
      this.selectedProductId = patch.productId;
      this.filterEndorsements();
    });
  }

  // ===== Helpers =====

  private dayNotInPastValidator = (ctrl: AbstractControl): ValidationErrors | null => {
    const value = ctrl.value as Date | null;
    if (!value) return null;
    const onlyDate = new Date(value.getFullYear(), value.getMonth(), value.getDate());
    const now = new Date();
    const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return onlyDate < todayOnly ? { dayPast: true } : null;
  };

  private toISODate(d: Date | string | null | undefined): string {
    if (!d) return '';
    const date = d instanceof Date ? d : new Date(d);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`; // yyyy-MM-dd pour LocalDate (back)
  }

  filterEndorsements(): void {
    if (this.selectedProductId != null) {
      this.filteredEndorsements = this.endorsements.filter(e =>
        e.product?.some(p => p.id === this.selectedProductId)
      );
      // si l’actType actuel (endorsement.id) n’est plus valide après filtrage → reset
      const current = this.formGroup.value.actType;
      if (current && !this.filteredEndorsements.some(e => e.id === current)) {
        this.formGroup.patchValue({ actType: null });
      }
    } else {
      this.filteredEndorsements = [];
      this.formGroup.patchValue({ actType: null });
    }
  }

  onProductSelected(productId: string): void {
    this.selectedProductId = productId;
    this.filterEndorsements();
  }

  trackById(index: number, item: { id: string }) {
    return item.id;
  }

  // ===== Submit =====

  onSubmit(): void {
    if (!this.formGroup.valid) {
      this.message = 'message.invalid';
      return;
    }

    // On prend directement les valeurs du formulaire,
    // on normalise UNIQUEMENT les 2 dates pour LocalDate côté back.
    const v = this.formGroup.value;
    const body = {
      ...v,
      dateEffective: this.toISODate(v.dateEffective),
      day: this.toISODate(v.day)
    };

    const request$ = this.editMode && this.accessoryId
      ? this._accessoryService.update(this.accessoryId, body as unknown as Accessory)
      : this._accessoryService.create(body as unknown as Accessory);

    request$.subscribe({
      next: () => {
        this.message = 'message.success';
        if (this.editMode) {
          this._layoutService.clearSelectedAccessory();
        } else {
          // reset du formulaire après création
          this.formGroup.reset({
            dateEffective: null,
            day: null,
            hour: 0,
            minute: 0,
            productId: null,
            actType: null,
            accessoryAmount: null,
            accessoryRisk: null
          });
          this.selectedProductId = null;
          this.filteredEndorsements = [];
        }
      },
      error: (error) => {
        this.message = 'message.error';
        console.error(error);
      }
    });
  }
}
