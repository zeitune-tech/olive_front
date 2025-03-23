import { Component } from "@angular/core";
import { UntypedFormGroup, FormBuilder, Validators } from "@angular/forms";
import { PointOfSale } from "@core/services/point-of-sale/point-of-sale.interface";
import { PointOfSaleService } from "@core/services/point-of-sale/point-of-sale.service";

@Component({
    selector: "app-points-of-sale-new",
    templateUrl: "./new.component.html",
})
export class PointsOfSaleNewComponent { 

    loading = false;

    types = [
        { value: 'GENERAL_AGENT', label: 'point-of-sale.new.form-type-general-agent' },
        { value: 'DIRECT_OFFICE', label: 'point-of-sale.new.form-type-direct-office' },
    ];

    formGroup!: UntypedFormGroup;
    /**
     * Constructor
     */
    constructor(
        private formBuilder: FormBuilder,
        private _pointOfSaleService: PointOfSaleService,
    ) { 
        this.formGroup = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.email]],
            phone: [''],
            address: [''],
            type: ['GENERAL_AGENT', Validators.required],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

        /**
     * Step one next
     */

    message: string = '';
    onSubmit(): void {
         // Return if the form is invalid
         if ( this.formGroup.invalid ) {
            return;
        }

        // Disable the form
        this.formGroup.disable();

        const pos: PointOfSale = this.formGroup.value;

        this._pointOfSaleService.create(
            pos
        ).subscribe({
            next: (pointOfSale: PointOfSale) => {
                this.message = 'point-of-sale.new.success';
                this.formGroup.reset();
                this.formGroup.enable();
            },
            error: (error) => {
                this.message = 'point-of-sale.new.error';
                this.formGroup.enable();
            }
        });
    }
    
}