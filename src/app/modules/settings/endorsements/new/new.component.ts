import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Product } from '@core/services/settings/product/product.interface';
import { ProductService } from '@core/services/settings/product/product.service';
import { LayoutService } from '../layout.service';
import { EndorsementService } from '@core/services/settings/endorsement/endorsement.service';

@Component({
  selector: 'app-accessory-new',
  templateUrl: './new.component.html'
})
export class EndorsementNewComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  message: string = '';

  /**
   *     
   * 
   * 
   */


  natures = [
    { value: 'NEW_BUSINESS', label: 'entities.endorsment.options.nature.NEW_BUSINESS' },
    { value: 'MODIFICATION', label: 'entities.endorsment.options.nature.MODIFICATION' },
    { value: 'SUSPENSION', label: 'entities.endorsment.options.nature.SUSPENSION' },
    { value: 'REINSTATEMENT', label: 'entities.endorsment.options.nature.REINSTATEMENT' }
  ];


  products: Product[] = [];
  editMode: boolean = false;
  endorsmentId: string | null = null;

  constructor(
    private _formBuilder: FormBuilder,
    private _layoutService: LayoutService,
    private _endorsmentService: EndorsementService,
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      designation: [null, Validators.required],
      nature: [null, Validators.required],
    });


    this._layoutService.selectedEndorsement$.subscribe((endorsement: any) => {
      if (endorsement) {
        this.editMode = true;
        this.endorsmentId = endorsement.id;
        this.formGroup.patchValue({
          designation: endorsement.designation,
          nature: endorsement.nature,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      if (this.editMode && this.endorsmentId) {
        this._endorsmentService.update(this.endorsmentId, data).subscribe({
          next: () => {
            this.message = 'message.success';
            this._layoutService.clearSelectedEndorsement();
          },
          error: (error) => {
            this.message = 'message.error';
            console.error(error);
          }
        });
      } else if (this.editMode && !this.endorsmentId) {
        this.message = 'message.error';
        console.error('Endorsement ID is required for update operation.');
      } else {
        this._endorsmentService.create(data).subscribe({
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
