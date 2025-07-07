import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ProductService } from '@core/services/settings/product/product.service';
import { CoverageDuration } from '@core/services/settings/coverage-duration/coverage-duration.interface';
import { CoverageDurationService } from '@core/services/settings/coverage-duration/coverage-duration.service';
import { DurationRateService } from '@core/services/settings/duration-rate/duration-rate.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-duration-rate-new',
  templateUrl: './new.component.html'
})
export class DurationRateNewComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  message: string = '';

  products: any[] = [];
  durations: CoverageDuration[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _durationRateService: DurationRateService,
    private _productService: ProductService,
    private _durationService: CoverageDurationService,
    @Inject(MAT_DIALOG_DATA) public data: { coverageDuration: CoverageDuration }
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      dateEffective: [null, Validators.required],
      rate: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      productId: [null, Validators.required],
      durationId: [this.data.coverageDuration.id, Validators.required]
    });

    this._productService.products$.subscribe(p => this.products = p);
    this._durationService.coverageDurations$.subscribe(p => this.durations = p);
  }

  onSubmit(): void {
      console.log(this.formGroup.value, "first");
    if (this.formGroup.valid) {
      console.log(this.formGroup.value);
      this.formGroup.disable();
      const data = this.formGroup.value;

      this._durationRateService.create(data).subscribe({
        next: () => {
          this.message = 'message.success';
          this.formGroup.reset();
        },
        error: () => {
          this.message = 'message.errors';
        },
        complete: () => this.formGroup.enable()
      });
    }
  }
}
