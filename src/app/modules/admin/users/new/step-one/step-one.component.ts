import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";


@Component({
    selector   : 'new-user-step-one',
    templateUrl: './step-one.component.html'
})
export class StepOneComponent implements OnInit {

    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;
    /**
     * Constructor
     */
    constructor(
        private formBuilder: FormBuilder
    ) { 
        this.formGroup = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
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