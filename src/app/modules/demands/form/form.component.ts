import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Demand } from "@core/services/demand/demand.interface";
import { DemandService } from './../../../core/services/demand/demand.service';
import { FormBuilder, UntypedFormGroup } from "@angular/forms";

@Component({
    selector: 'app-demand-form',
    templateUrl: './form.component.html',
})
export class DemandFormComponent implements OnInit {

    form: UntypedFormGroup;
    types = [
        { value: 'LINK', label: 'demand.types.partner' },
        { value: 'ATTESTATION', label: 'demand.types.attestation' }
    ];

    loading = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _dialogRef : MatDialogRef<DemandFormComponent>,
        private _demandService: DemandService,
        private _formBuilder: FormBuilder
    ) {

        this.form = this._formBuilder.group({
            id: [null],
            title: [null],
            description: [null],
            company_id: [null],
            company: [null],
            status: [null],
            created_at: [null],
            updated_at: [null],
        });
    }

    ngOnInit() {

    }
}