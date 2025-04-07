import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { PointOfSale } from "@core/services/administration/point-of-sale/point-of-sale.interface";
import { PointOfSaleService } from "@core/services/administration/point-of-sale/point-of-sale.service";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector   : 'new-user-step-three',
    templateUrl: './step-three.component.html'
})
export class StepThreeComponent implements OnInit {
    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;
    
    pointsOfSale:PointOfSale[] = []

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _pointOfSaleService: PointOfSaleService
    ) { 
        this.formGroup = this._formBuilder.group({
           pointOfSale: ['', Validators.required],
           pointOfSaleName: ['']
        });

        this._pointOfSaleService.pointsOfSale$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((pointsOfSale) => {
            this.pointsOfSale = pointsOfSale;
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
        this.formGroup.get('pointOfSaleName')?.setValue(this.pointsOfSale.find(p => p.id === this.formGroup.get('pointOfSale')?.value)?.name);
        this.formReady.emit(this.formGroup);
    }
}