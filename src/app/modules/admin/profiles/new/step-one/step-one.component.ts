import { Component, EventEmitter, Output } from "@angular/core";
import { UntypedFormGroup, FormBuilder, Validators } from "@angular/forms";
import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";
import { ManagementEntityService } from "@core/services/administration/management-entity/management-entity.service";
import { Subject } from "rxjs";

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
    ) { 
        this.formGroup = this.formBuilder.group({
            name: ['', Validators.required],
            level: ['COMPANY', Validators.required],
            description: [''],
        });

        this._managementEntityService.entity$.subscribe({
            next: (entity) => {
                this.entity = entity;
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
    }
}
