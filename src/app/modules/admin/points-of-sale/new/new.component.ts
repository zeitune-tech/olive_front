import { Component } from "@angular/core";
import { UntypedFormGroup, FormBuilder, Validators } from "@angular/forms";
import { PointOfSale } from "@core/services/administration/point-of-sale/point-of-sale.interface";
import { PointOfSaleService } from "@core/services/administration/point-of-sale/point-of-sale.service";
import { User } from "@core/services/auth/user/user.interface";
import { UserService } from "@core/services/auth/user/user.service";

@Component({
    selector: "app-points-of-sale-new",
    templateUrl: "./new.component.html",
})
export class PointsOfSaleNewComponent { 

    loading = false;
    user: User | null = null;

    types = [
        { value: 'GENERAL_AGENT', label: 'entities.point_of_sale.options.type.GENERAL_AGENT' },
        { value: 'DIRECT_OFFICE', label: 'entities.point_of_sale.options.type.DIRECT_OFFICE' },
    ];

    formGroup!: UntypedFormGroup;
    /**
     * Constructor
     */
    constructor(
        private formBuilder: FormBuilder,
        private _userService: UserService,
        private _pointOfSaleService: PointOfSaleService,
    ) { 
        this._userService.user$.subscribe((user: User) => {
            this.user = user;
        });
        this.formGroup = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.email]],
            phone: ['', Validators.required],
            address: [''],
            typePointOfSale: ['DIRECT_OFFICE', Validators.required],
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

    message: string = '';
    onSubmit(): void {
         // Return if the form is invalid
         if ( this.formGroup.invalid ) {
            return;
        }

        // Disable the form
        this.formGroup.disable();

        const pos: PointOfSale = this.formGroup.value;

        this._pointOfSaleService.create(
            pos
        ).subscribe({
            next: (pointOfSale: PointOfSale) => {
                this._pointOfSaleService.getAll().subscribe();
                this.message = 'message.success';
                this.formGroup.reset();
                this.formGroup.enable();
            },
            error: (error) => {
                this.message = 'message.error';
                this.formGroup.enable();

            }
        });
    }
    
}