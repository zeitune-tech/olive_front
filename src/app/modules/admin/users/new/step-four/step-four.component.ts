import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { Role } from "@core/services/employee/employee.inteface";
import { EmployeeService } from "@core/services/employee/employee.service";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: 'new-employee-step-four',
    templateUrl: './step-four.component.html'
})
export class StepFourComponent implements OnInit { 

    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    formGroup!: UntypedFormGroup;
    roles: Role[] = [];

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _employeeService: EmployeeService

    ) {
        this.formGroup = this._formBuilder.group({
            role: ['', Validators.required],
            roleName: ['']
        });
        this._employeeService.roles$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((roles) => {
            this.roles = roles;
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
        this.formGroup.get('roleName')?.setValue(this.roles.find(r => r.id === this.formGroup.get('role')?.value)?.name);
        this.formReady.emit(this.formGroup);
    }
}