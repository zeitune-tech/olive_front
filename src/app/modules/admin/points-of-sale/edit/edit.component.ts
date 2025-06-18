import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PointOfSale } from "@core/services/administration/point-of-sale/point-of-sale.interface";
import { PointOfSaleService } from "@core/services/administration/point-of-sale/point-of-sale.service";

@Component({
    selector: "app-point-of-sale-edit",
    templateUrl: "./edit.component.html"
})
export class PointOfSaleEditComponent implements OnInit {

    formGroup!: UntypedFormGroup;
    types = [
        { value: 'GENERAL_AGENT', label: 'entities.point_of_sale.options.type.GENERAL_AGENT' },
        { value: 'DIRECT_OFFICE', label: 'entities.point_of_sale.options.type.DIRECT_OFFICE' },
    ];
    message: string = '';

    constructor(
        private formBuilder: FormBuilder,
        private _pointOfSaleService: PointOfSaleService,
        private dialogRef: MatDialogRef<PointOfSaleEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: PointOfSale
    ) {}

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({
            name: [this.data?.name || '', Validators.required],
            email: [this.data?.email || '', [Validators.email]],
            phone: [this.data?.phone || '', Validators.required],
            address: [this.data?.address || ''],
            typePointOfSale: [this.data?.typePointOfSale || 'DIRECT_OFFICE', Validators.required],
        });
    }

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();
        const updatedPos: PointOfSale = { ...this.data, ...this.formGroup.value };

        this._pointOfSaleService.update(updatedPos).subscribe({
            next: () => {
                this.message = 'message.success';
                this.dialogRef.close(true); // pour fermer le dialog et indiquer le succès
            },
            error: () => {
                this.message = 'message.error';
                this.formGroup.enable();
            }
        });
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
