import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { ContributorLevel } from "@core/services/administration/contributor/contributor.interface";
import { ContributorService } from "@core/services/administration/contributor/contributor.service";
import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";
import { ManagementEntityService } from "@core/services/administration/management-entity/management-entity.service";
import { PointOfSale } from "@core/services/administration/point-of-sale/point-of-sale.interface";
import { PointOfSaleService } from "@core/services/administration/point-of-sale/point-of-sale.service";


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
    pointsOfSale: PointOfSale[] = [];

    constructor(
        private fb: FormBuilder,
        private contributorService: ContributorService,
        private _pointOfSaleService: PointOfSaleService,
        private _managementEntityService: ManagementEntityService
    ) {

        this._managementEntityService.entity$.subscribe((entity: ManagementEntity | null) => {
            if (entity?.type === 'POINT_OF_SALE') {
                this.levels = [
                    { value: ContributorLevel.POINT_OF_SALE, label: 'entities.contributor.options.level.POINT_OF_SALE' }
                ]
            }
        });

        this._pointOfSaleService.pointsOfSale$.subscribe((pointsOfSale: PointOfSale[]) => {
            this.pointsOfSale = pointsOfSale;
            if (this.pointsOfSale.length === 1) {
                this.formGroup.patchValue({ pointOfSale: this.pointsOfSale[0].id });
            }
        })

        
    }

    
    validatePointOfSale(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const level = this.formGroup?.get('level')?.value;
            const pointOfSale = control.value;

            if (level === ContributorLevel.POINT_OF_SALE && !pointOfSale) {
                return { required: true };
            }
            return null;
        };
    }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.email]],
            gsm: ['', Validators.pattern(/^\+?[0-9\s]+$/)], // GSM validation pattern
            level: [ContributorLevel.COMPANY, Validators.required],
            pointOfSale: [null],
        });
            this.formGroup.get("pointOfSale")?.disable();

    }

    onLevelChange(level: any) {
        console.log(level)
        if (level === ContributorLevel.POINT_OF_SALE) {
            this.formGroup.get("pointOfSale")?.enable();
        } else {
            this.formGroup.get("pointOfSale")?.disable();
        }
    }

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const contributor = this.formGroup.value;

        console.log(contributor);

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
