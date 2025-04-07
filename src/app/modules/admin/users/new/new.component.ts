import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { UntypedFormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";
import { UserService } from "@core/services/auth/user/user.service";
import { animations } from "@lhacksrt/animations";
import { ConfirmDialogComponent } from "@shared/components/confirm-dialog/confirm-dialog.component";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-users-new",
    templateUrl: "./new.component.html",
    encapsulation: ViewEncapsulation.None,
    animations   : animations
})
export class UsersNewComponent implements OnInit { 

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

    data: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        accessLevel: string;
        pointOfSale: string;
        profiles: {name: string, id: string}[];
        password: string;
        managementEntityId: string;
        managementEntityName: string;
    } = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        accessLevel: '',
        pointOfSale: '',
        profiles: [],
        password: 'P@sser123',
        managementEntityId: '',
        managementEntityName: ''
    };

    managementEntity!: ManagementEntity;

    constructor(
        private _userService: UserService,
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
            case 'MARKET_LEVEL_ORGANISATION':
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
        this.data.profiles = fromGroup.value.profiles;
    }


    save(): void {
        this._userService.create(this.data)
        .subscribe(() => {
            this._userService.getAll().subscribe();
            this._router.navigate(['/users/list']);
        });
    }
}