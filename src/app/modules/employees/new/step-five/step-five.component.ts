import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'new-employee-step-five',
    templateUrl: './step-five.component.html'
})
export class StepFiveComponent implements OnInit { 

    @Output() formReady = new EventEmitter<UntypedFormGroup>();

    formGroup!: UntypedFormGroup;

    /**
     * Constructor
     */
    constructor(
        private formBuilder: FormBuilder
    ) {
        this.formGroup = this.formBuilder.group({
            'password': ['', Validators.required],
            'passwordConfirmation': ['', Validators.required]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    ngOnInit(): void {}


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