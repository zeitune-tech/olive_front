import { Component, ViewChild } from '@angular/core';
import { UntypedFormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ManagementEntity } from '@core/services/administration/management-entity/management-entity.interface';
import { ProfileService } from '@core/services/auth/profile/profile.service';
import { UserService } from '@core/services/auth/user/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-profiles-new',
    templateUrl: './new.component.html',
})
export class ProfilesNewComponent {


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
        name: string;
        description: string;
        level: string;
        permissions: {name: string, id: string}[];
    } = {
        name: '',
        description: '',
        level: '',
        permissions: [],
    };

    managementEntity!: ManagementEntity;

    constructor(
        private _userService: UserService,
        private _profileService: ProfileService,
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
           
        });
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onStepOneNext(fromGroup: UntypedFormGroup): void {
        this.formStepOne = fromGroup;
        this.data.name = fromGroup.value.name;
        this.data.level = fromGroup.value.level;
        this.data.description = fromGroup.value.description;

        console.log(this.data)
        
    }


    onStepTwoNext(fromGroup: UntypedFormGroup): void {
        this.formStepTwo = fromGroup;
        this.data.permissions = fromGroup.value.permissions;
    }


    save(): void {
        this._profileService.create(this.data)
        .subscribe({
            next: (profile) => {
                this._profileService.getAll().subscribe();
                this._router.navigate(['/administration/profiles/list']);
            },
            error: (error) => {

            }
        });
    }
}