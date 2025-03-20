import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";


@Component({
    selector   : 'new-employee-step-two',
    templateUrl: './step-two.component.html'
})
export class StepTwoComponent implements OnInit {

    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;
    accessLevels = [
        { value: 'DEFAULT', label: 'employee.new.form-access-level-entreprise' },
        { value: 'POINT_OF_SALE', label: 'employee.new.form-access-level-point-of-sale' },
    ];

    /**
     * Constructor
     */
    constructor(
        private formBuilder: FormBuilder
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
    }
}