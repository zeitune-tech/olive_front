import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { StepperDataService } from "../form.service";


@Component({
    selector   : 'new-user-step-two',
    templateUrl: './step-two.component.html'
})
export class StepTwoComponent implements OnInit {

    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;
    accessLevels = [
        { value: 'COMPANY', label: 'enums.managementEntityLevel.COMPANY' },
        { value: 'POINT_OF_SALE', label: 'enums.managementEntityLevel.POINT_OF_SALE' }
    ];

    /**
     * Constructor
     */
    constructor(
        private formBuilder: FormBuilder,
        private _stepperDataService: StepperDataService,
    ) { 
        this.formGroup = this.formBuilder.group({
            accessLevel: [this.accessLevels[0].value, Validators.required]
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
        this._stepperDataService.setLevel(this.formGroup.get('accessLevel')?.value);
    }
}