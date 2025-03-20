import { Component, Inject } from "@angular/core";
import { FormBuilder, UntypedFormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AttestationLot } from "@core/services/attestation/attestation.interface";
import { ManagementEntity } from "@core/services/management-entity/management-entity.interface";
import { AttestationService } from "@core/services/attestation/attestation.service";

@Component({
    selector: "app-attestation-attribute",
    templateUrl: "./attribute.component.html",
})
export class AttestationAttributeComponent { 

    loading = false;
    form: UntypedFormGroup;

    attestations: AttestationLot[] = [];
    assignTo: ManagementEntity;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _dialogRef : MatDialogRef<AttestationAttributeComponent>,
        private _attestationService: AttestationService,
        private _formBuilder: FormBuilder
    ) {

        this.assignTo = this.data.assignTo;
        this.form = this._formBuilder.group({
            attestation: [null],
            assignTo: [this.assignTo?.name],
            quantity: [100],
        });


        this._attestationService.myAttestations$.subscribe({
            next: attestations => {
                this.attestations = attestations;
            }
        });
    }

    save() {
        this.loading = true;
        this._attestationService.attribute(
            this.form.value.attestation,
            this.assignTo.id,
            { quantity: this.form.value.quantity }
        ).subscribe({
            next: () => {
                this.loading = false;
                this._dialogRef.close();
            }
        });
    }
}