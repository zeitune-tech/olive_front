import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ContributorLevel } from "@core/services/administration/contributor/contributor.interface";
import { ContributorService } from "@core/services/administration/contributor/contributor.service";
import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";
import { ManagementEntityService } from "@core/services/administration/management-entity/management-entity.service";

@Component({
    selector: "app-contributor-new",
    templateUrl: "./new.component.html"
})
export class ContributorNewComponent implements OnInit {

    formGroup!: FormGroup;
    message: string = '';
    levels: {
        value: typeof ContributorLevel[keyof typeof ContributorLevel];
        label: string;
    }[] = [
        { value: ContributorLevel.COMPANY, label: 'entities.contributor.options.level.COMPANY' },
        { value: ContributorLevel.POINT_OF_SALE, label: 'entities.contributor.options.level.POINT_OF_SALE' },
    ];

    constructor(
        private fb: FormBuilder,
        private contributorService: ContributorService,
        private _managementEntityService: ManagementEntityService
    ) {
        this.formGroup = this.fb.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.email]],
            level: [ContributorLevel.COMPANY, Validators.required],
        });

        this._managementEntityService.entity$.subscribe((entity: ManagementEntity | null) => {
            if (entity?.type === 'POINT_OF_SALE') {
                this.levels = [
                    { value: ContributorLevel.POINT_OF_SALE, label: 'entities.contributor.options.level.POINT_OF_SALE' }
                ]
            }
        });
    }

    ngOnInit(): void {}

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const contributor = this.formGroup.value;

        this.contributorService.create(contributor).subscribe({
            next: () => {
                this.message = 'message.success';
                this.formGroup.reset();
                this.formGroup.enable();
            },
            error: () => {
                this.message = 'message.error';
                this.formGroup.enable();
            }
        });
    }
}
