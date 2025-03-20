import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import {map, startWith} from 'rxjs/operators';

@Component({
    selector   : 'new-insured-step-two',
    templateUrl: './step-two.component.html'
})
export class StepTwoComponent implements OnInit {

    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;

    models!: Observable<string[]>;
    modelsOptions: string[] = [
        'Toyota',
        'Nissan',
        'Mitsubishi',
        'Honda',
        'Suzuki',
        'Subaru',
        'Isuzu',
        'Mazda',
        'Daihatsu',
        'Mercedes-Benz',
        'BMW',
        'Audi',
        'Volkswagen',
        'Ford',
        'Chevrolet',
        'Jeep',
        'Hyundai',
        'Kia',
        'Volvo',
    ];
    years!: Observable<string[]>;
    yearsOptions: string[] = [
        '2025',
        '2024',
        '2023',
        '2022',
        '2021',
        '2020',
        '2019',
        '2018',
        '2017',
        '2016',
        '2015',
        '2014',
        '2013',
        '2012',
        '2011',
        '2010',
        '2009',
        '2008',
        '2007',
        '2006',
        '2005',
        '2004',
        '2003',
        '2002',
        '2001',
        '2000',
        '1999',
        '1998',
        '1997',
        '1996',
        '1995',
        '1994',
        '1993',
        '1992',
        '1991',
        '1990',
    ];
    usages!: Observable<string[]>;
    usagesOptions: string[] = [
        'Private',
        'Commercial',
        'Public',
        'Government',
        'Military',
    ];
    fuels!: Observable<string[]>;
    fuelsOptions: string[] = [
        'Gasoline',
        'Diesel',
        'Electric',
        'Hybrid',
        'LPG',
        'CNG',
    ];
    powers!: Observable<string[]>;
    powersOptions: string[] = [
        '1000cc',
        '1200cc',
        '1300cc',
        '1400cc',
        '1500cc',
        '1600cc',
        '1700cc',
        '1800cc',
        '1900cc',
        '2000cc',
        '2100cc',
        '2200cc',
        '2300cc',
        '2400cc',
        '2500cc',
        '2600cc',
        '2700cc',
        '2800cc',
        '2900cc',
        '3000cc',
        '3100cc',
        '3200cc',
        '3300cc',
        '3400cc',
        '3500cc',
        '3600cc',
        '3700cc',
        '3800cc',
        '3900cc',
        '4000cc',
        '4100cc',
        '4200cc',
        '4300cc',
        '4400cc',
        '4500cc',
        '4600cc',
        '4700cc',
        '4800cc',
        '4900cc',
        '5000cc',
        '5100cc',
        '5200cc',
        '5300cc',
        '5400cc',
        '5500cc',
        '5600cc',
        '5700cc',
        '5800cc',
        '5900cc',
        '6000cc',
        '6100cc',
        '6200cc',
        '6300cc',
        '6400cc',
        '6500cc',
        '6600cc',
        '6700cc',
        '6800cc',
        '6900cc',
        '7000cc',
        '7100cc',
        '7200cc',
        '7300cc',
        '7400cc',
        '7500cc',
        '7600cc',
        '7700cc',
        '7800cc',
        '7900cc',
        '8000cc',
        '8100cc',
        '8200cc',
        '8300cc',
        '8400cc',
        '8500cc',
        '8600cc',
        '8700cc',
        '8800cc',
        '8900cc',
        '9000cc',
        '9100cc',
        '9200cc',
        '9300cc',
    ];

    /**
     * Constructor
     */
    constructor(
        private formBuilder: FormBuilder
    ) { 
        this.formGroup = this.formBuilder.group({
            registrationNumber: ['', Validators.required],
            chassisNumber: ['', Validators.required],
            engineNumber: ['', Validators.required],
            model: ['', Validators.required],
            color: ['', ],
            type: ['', ],
            brand: ['', ],
            category: ['', ],
            usage: ['', Validators.required],
            fuel: ['', Validators.required],
            power: ['', Validators.required],
            weight: ['', ],
            year: ['', Validators.required],
            country: ['', ],
            places: ['', Validators.required],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.models = this.formGroup.get('model')!.valueChanges.pipe(
            startWith(''),
            map(value =>this._filter(value, this.modelsOptions))
        );
        this.years = this.formGroup.get('year')!.valueChanges.pipe(
            startWith(''),
            map(value =>this._filter(value, this.yearsOptions))
        );
        this.usages = this.formGroup.get('usage')!.valueChanges.pipe(
            startWith(''),
            map(value =>this._filter(value, this.usagesOptions))
        );
        this.fuels = this.formGroup.get('fuel')!.valueChanges.pipe(
            startWith(''),
            map(value =>this._filter(value, this.fuelsOptions))
        );
        this.powers = this.formGroup.get('power')!.valueChanges.pipe(
            startWith(''),
            map(value =>this._filter(value, this.powersOptions))
        );
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

    private _filter(value: string, options: string[]): string[] {
        const filterValue = value.toLowerCase();
        return options.filter(option =>option.toLowerCase().includes(filterValue));
    }
}