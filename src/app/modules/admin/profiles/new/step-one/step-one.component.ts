import { Component, EventEmitter, Output } from "@angular/core";
import { UntypedFormGroup, FormBuilder, Validators } from "@angular/forms";
import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";
import { ManagementEntityService } from "@core/services/administration/management-entity/management-entity.service";
import { Subject } from "rxjs";
import { StepperDataService } from "../form.service";
import { LayoutService } from "../../layout.service";

@Component({
    selector: "app-profiles-new-step-one",
    templateUrl: "./step-one.component.html",
})
export class ProfilesNewStepOneComponent {

    unsubscribeAll: Subject<any> = new Subject<any>();

    levels :string[] = [
        "COMPANY",
        "POINT_OF_SALE",
    ];

    entity: ManagementEntity = {} as ManagementEntity;

    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;
    /**
     * Constructor
     */
    constructor(
        private formBuilder: FormBuilder,
        private _managementEntityService: ManagementEntityService,
        private _stepperDataService: StepperDataService,
        private _layoutService:LayoutService
    ) { 
        this.formGroup = this.formBuilder.group({
            name: ['', Validators.required],
            level: ['COMPANY', Validators.required],
            description: [''],
        });

        this._managementEntityService.entity$.subscribe({
            next: (entity) => {
                this.entity = entity;
                this.formGroup.patchValue({
                    level: entity.type,
                });

            }
        });

        this._layoutService.selectedProfile$.subscribe({
            next: (profile) => {
                if (profile) {
                    this.formGroup.patchValue({
                        name: profile.name,
                        description: profile.description,
                        level: profile.level,
                    });
                }
            }
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
    onNext(): void {
        this.formReady.emit(this.formGroup);
        this._stepperDataService.setLevel(this.formGroup.get('level')?.value);
    }
}
