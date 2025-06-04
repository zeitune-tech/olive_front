import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { ProductService } from "@core/services/administration/product/product.service";
import { CoverageReferenceService } from "@core/services/settings/coverage-reference/coverage-reference.service";
import { Product } from "@core/services/administration/product/product.interface";
import { TranslocoService } from "@jsverse/transloco";
import { CoverageService } from "@core/services/settings/coverage/coverage.service";

@Component({
    selector: "app-coverage-referentials-new",
    templateUrl: "./new.component.html",
})
export class CoverageReferenceNewComponent implements OnInit, OnDestroy {

    formGroup!: UntypedFormGroup;

    private destroy$ = new Subject<void>();

    families = [
        { value: 'RC', label: 'entities.coverage_reference.options.family.RC' },
        { value: 'DOMMAGES', label: 'entities.coverage_reference.options.family.DOMMAGES' },
        { value: 'OTHERS', label: 'entities.coverage_reference.options.family.OTHERS' }
    ]

    constructor(
        private _formBuilder: FormBuilder,
        private _coverageReferentialService: CoverageReferenceService,
        private _coverageService: CoverageService,
        private _productService: ProductService,
        private _translocoService: TranslocoService,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.initForm();

    }

    private initForm(): void {
        this.formGroup = this._formBuilder.group({
            designation: ['', Validators.required],
            family: [''],
            accessCharacteristic: [null, Validators.required],
            tariffAccess: [null, Validators.required],
        });
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.formGroup.disable();

            this._coverageReferentialService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.showSnackBar('form.success.creation', 'success');
                    this.formGroup.enable();
                    this.formGroup.reset();
                    this._coverageService.getAll().subscribe();
                },
                error: () => {
                    this.showSnackBar('form.errors.submission', 'error');
                    this.formGroup.enable();
                }
            });
        }
    }

    showSnackBar(messageKey: string, type: 'success' | 'error'): void {
        const message = this._translocoService.translate(messageKey);
        this._snackBar.open(message, undefined, {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
