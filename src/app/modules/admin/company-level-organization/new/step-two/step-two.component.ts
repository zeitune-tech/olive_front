import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { UntypedFormGroup, FormBuilder, Validators, UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PointOfSale } from "@core/services/administration/point-of-sale/point-of-sale.interface";
import { PointOfSaleService } from "@core/services/administration/point-of-sale/point-of-sale.service";
import { TranslocoService } from "@jsverse/transloco";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-company-level-organization-new-step-two",
    templateUrl: "./step-two.component.html",
})
export class CompanyLevelOrganizationNewStepTwoComponent {

    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<PointOfSale> = {
        title: '',
        columns: [
            { label: 'entities.point_of_sale.fields.name', property: 'name', type: 'text', visible: true },
            { label: 'entities.point_of_sale.fields.type', property: 'typePointOfSale', type: 'text', visible: true },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: PointOfSale, property: keyof PointOfSale) => {
            if (property === 'typePointOfSale') {
                return this._translateService.translate(`entities.point_of_sale.options.type.${element[property]}`);
            }
            return element[property];
        },
    };
    data: PointOfSale[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<PointOfSale> = new MatTableDataSource();
    selection = new SelectionModel<PointOfSale>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _pointOfSaleService: PointOfSaleService,
        private _translateService: TranslocoService,
        private formBuilder: FormBuilder
    ) { 
        this.formGroup = this.formBuilder.group({
            pointsOfSale: [[], Validators.required],
        });
    }

    
    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;


    ngOnInit(): void {
        this._pointOfSaleService.pointsOfSale$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: PointOfSale[]) => {
            // Filtrer uniquement les points de vente non encore associés à une organisation
            const filteredPointsOfSale = data.filter(p => !p.superiorEntity || p.superiorEntity === null);

            this.data = filteredPointsOfSale;
            this.dataSource.data = filteredPointsOfSale;
            this._changeDetectorRef.detectChanges();
        });

    }

    ngAfterViewInit() {
        if (this.dataSource) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    preview() {
        console.log('preview');
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('checkbox');
        return columns;
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
        // add the selected ids to the form
        this.formGroup?.get('pointsOfSale')?.setValue(this.selection.selected.map(pointOfSale => ({
            name: pointOfSale.name,
            id: pointOfSale.id
        })));
    }

    toggleSelection(row: PointOfSale) {
        this.selection.toggle(row);
        // add the selected ids to the form
        this.formGroup?.get('pointsOfSale')?.setValue(this.selection.selected.map(pointOfSale => ({
            name: pointOfSale.name,
            id: pointOfSale.id
        })));
    }


    trackByProperty(index: number, column: TableColumn<PointOfSale>) {
        return column.property;
    }


    onNext(): void {
        this.formReady.emit(this.formGroup);
    }
}