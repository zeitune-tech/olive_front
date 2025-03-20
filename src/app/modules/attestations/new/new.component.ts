import { Component } from "@angular/core";
import { UntypedFormGroup, FormBuilder, Validators } from "@angular/forms";
import { Attestation } from "@core/services/attestation/attestation.interface";
import { AttestationService } from "@core/services/attestation/attestation.service";

@Component({
    selector: "app-attestation-new",
    templateUrl: "./new.component.html",
})
export class AttestationNewComponent {

    loading = false;

    branches = [
        { value: '9b04c0c2-2ed0-45d4-a52f-78e69f9fa874', label: 'Automobile' },
        { value: '8095f945-4493-4419-97cf-1e5617193db6', label: 'Risque Divers' },
    ]

    formGroup!: UntypedFormGroup;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _attestationService: AttestationService,
    ) { 
        this.formGroup = this._formBuilder.group({
            prefix: ['', Validators.required],
            quantity: ['', Validators.required],
            // secret: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
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

        const attestation: Attestation = this.formGroup.value;

        this._attestationService.create(
            attestation
        ).subscribe({
            next: (_attestation: Attestation) => {
                this.message = 'point-of-sale.new.success';
                this.formGroup.reset();
                this.formGroup.enable();
            },
            error: (_error) => {
                this.message = 'point-of-sale.new.error';
                this.formGroup.enable();
            }
        });
    }
    
}