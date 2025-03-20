import { Component, ViewChild } from "@angular/core";
import { UntypedFormGroup, NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { EmployeeService } from "@core/services/employee/employee.service";
import { ManagementEntity } from "@core/services/management-entity/management-entity.interface";
import { UserService } from "@core/services/user/user.service";
import { ConfirmDialogComponent } from "@shared/components/confirm-dialog/confirm-dialog.component";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-insureds-new",
    templateUrl: "./new.component.html",
})
export class InsuredsNewComponent { 
    
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    ACCESS_LEVELS = [
        "ENTITY_SUPERIOR_USER",
        "COMPANY_USER",
        "POINT_OF_SALE_USER"
    ];

    formGroup!: UntypedFormGroup;
    @ViewChild('form') form!: NgForm;

    showAlert: boolean = false;
        
    formStepOne!: UntypedFormGroup;
    formStepTwo!: UntypedFormGroup;
    formStepThree!: UntypedFormGroup;
    formStepFour!: UntypedFormGroup;
    formStepFive!: UntypedFormGroup;

    selectedIndex: number = 0;

    currentIsCompanyEmployee: boolean = false;
    newHasPointOfSaleAccessLevel: boolean = false;
    currentAccessLevel: string = '';

    data: any = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        accessLevel: '',
        pointOfSale: '',
        role: '',
        roleName: '',
        password: 'P@sser123',
        managementEntityId: '',
        managementEntityName: ''
    };

    managementEntity!: ManagementEntity;

    constructor(
        private _userService: UserService,
        private _employeeService: EmployeeService,
        private _dialog: MatDialog,
        private _router: Router
    ) {  }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._userService.user$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((user) => {
            if (user) {
                this.currentIsCompanyEmployee = user.managementEntity.level === 'COMPANY';
                this.currentAccessLevel = user.managementEntity.level;
                this.managementEntity = user.managementEntity;
            }
        });
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onStepOneNext(fromGroup: UntypedFormGroup): void {
        this.formStepOne = fromGroup;
        this.data.firstName = fromGroup.value.firstName;
        this.data.lastName = fromGroup.value.lastName;
        this.data.email = fromGroup.value.email;
        this.data.phone = fromGroup.value.phone;
        if (!this.currentIsCompanyEmployee) {
            this.getAccessLevel();
            this.data.managementEntityId = this.managementEntity.id;
            this.data.managementEntityName = this.managementEntity.name;
        }
    }

    getAccessLevel(): void {
        switch (this.currentAccessLevel) {
            case 'ENTITY_SUPERIOR':
                this.data.accessLevel = this.ACCESS_LEVELS[0];
                break;
            case 'COMPANY':
                this.data.accessLevel = this.ACCESS_LEVELS[1];
                break;
            case 'POINT_OF_SALE':
                this.data.accessLevel = this.ACCESS_LEVELS[2];
                break;
            default:
                break;
        }
    }

    onStepTwoNext(fromGroup: UntypedFormGroup): void {
        this.formStepTwo = fromGroup;
        if (fromGroup.value.accessLevel === 'POINT_OF_SALE') {
            this.newHasPointOfSaleAccessLevel = true;
            this.data.accessLevel = this.ACCESS_LEVELS[2];
        } else {
            this.newHasPointOfSaleAccessLevel = false;
            this.data.accessLevel = this.ACCESS_LEVELS[1];
            this.data.managementEntityId = this.managementEntity.id;
            this.data.managementEntityName = this.managementEntity.name;
        }
    }

    onStepThreeNext(fromGroup: UntypedFormGroup): void {
        this.formStepThree = fromGroup;
        this.data.managementEntityId = fromGroup.value.pointOfSale;
        this.data.managementEntityName = fromGroup.value.pointOfSaleName;
    }

    onStepFourNext(fromGroup: UntypedFormGroup): void {
        this.formStepFour = fromGroup;
        this.data.role = fromGroup.value.role;
        this.data.roleName = fromGroup.value.roleName;
    }

    onStepFiveNext(fromGroup: UntypedFormGroup): void {
        this.formStepFive = fromGroup;
        this.confirm();
    }


    confirm(): void {
        this._dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'employee.new.confirm-dialog-title',
                message: 'employee.new.confirm-dialog-message',
                confirmButtonLabel: 'employee.new.confirm-dialog-confirm-button',
                cancelButtonLabel: 'employee.new.confirm-dialog-cancel-button',
                confirm: () => {
                    this.save();
                }
            }
        })
    }

    save(): void {
        this._employeeService.create(this.data)
        .subscribe(() => {
            this._router.navigate(['/employees']);
        });
    }
}