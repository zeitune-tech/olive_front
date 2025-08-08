import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ManagementEntity } from '@core/services/administration/management-entity/management-entity.interface';
import { ManagementEntityService } from '@core/services/administration/management-entity/management-entity.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'contract-preview',
    templateUrl: './preview.component.html',
})
export class PreviewComponent implements OnInit {

    _unsubscribeAll: Subject<any> = new Subject<any>();


    @Input() formStepOne: UntypedFormGroup = new UntypedFormGroup({});
    @Input() formStepTwo: UntypedFormGroup = new UntypedFormGroup({});
    @Input() formStepThree: UntypedFormGroup = new UntypedFormGroup({});
    @Input() formStepFour: UntypedFormGroup = new UntypedFormGroup({});
    @Input() formStepFive: UntypedFormGroup = new UntypedFormGroup({});

    today = new Date();

    company!: ManagementEntity;

    coverages: any[] = [
        { name: 'Responsabilité Civile', amount: 33846 },
    ];
    totalCoverages: number = 33846;

    constructor(
        private _companyService: ManagementEntityService
    ) {

        this._companyService.entity$.pipe(takeUntil(this._unsubscribeAll)).subscribe((company: ManagementEntity) => {
            this.company = company || {
                id: '',
                name: '',
                logo: '',
                code: '',
                email: '',
                phone: '',
                address: '',
                type: 'COMPANY',
                superiorEntity: undefined,
                linked: false,
            };
        });

    }

    ngOnInit(): void {
         
    }
}
