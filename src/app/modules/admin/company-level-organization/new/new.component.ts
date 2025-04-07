import { Component, ViewChild } from "@angular/core";
import { UntypedFormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CompanyLevelOrganization } from "@core/services/administration/company-level-organization/company-level-organization.interface";
import { CompanyLevelOrganizationService } from "@core/services/administration/company-level-organization/company-level-organization.service";
import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";
import { UserService } from "@core/services/auth/user/user.service";
import { ConfirmDialogComponent } from "@shared/components/confirm-dialog/confirm-dialog.component";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-company-level-organization-new",
    templateUrl: "./new.component.html",
})
export class CompanyLevelOrganizationNewComponent {
   
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
        pointsOfSale: {name: string, id: string}[];
    } = {
        name: '',
        description: '',
        pointsOfSale: [],
    };

    managementEntity!: ManagementEntity;

    constructor(
        private _userService: UserService,
        private _companyLevelOrganizationService: CompanyLevelOrganizationService,
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
        this.data.name = fromGroup.value.name;
        this.data.description = fromGroup.value.description;
    }


    onStepTwoNext(fromGroup: UntypedFormGroup): void {
        this.formStepTwo = fromGroup;
        this.data.pointsOfSale = fromGroup.value.pointsOfSale;
    }



    save(): void {
        const val = confirm("Are you sure you want to save this company level organization?");
        if (val) {
            this._companyLevelOrganizationService.create(this.data)
            .subscribe({
                next: (companyLevelOrganization: CompanyLevelOrganization) => {
                    this._companyLevelOrganizationService.getAll().subscribe();
                },
                error: (error: any) => {
                    console.error(error);
                }
            });
        }
    }
}