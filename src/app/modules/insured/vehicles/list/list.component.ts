import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Vehicle } from "@core/services/insured/vehicle/vehicle.interface";
import { VehicleService } from "@core/services/insured/vehicle/vehicle.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-vehicles-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class VehiclesListComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<Vehicle> = {
        title: '',
        columns: [
            { label: 'entities.vehicle.fields.licensePlate', property: 'licensePlate', visible: true, type: 'text' },
            { label: 'entities.vehicle.fields.brand', property: 'brand', visible: true, type: 'text' },
            { label: 'entities.vehicle.fields.model', property: 'model', visible: true, type: 'text' },
            { label: 'entities.vehicle.fields.fuelType', property: 'fuelType', visible: true, type: 'text' },
            { label: 'entities.vehicle.fields.gearboxType', property: 'gearboxType', visible: true, type: 'text' },
            { label: 'entities.vehicle.fields.fiscalPower', property: 'fiscalPower', visible: true, type: 'text' },
            { label: 'entities.vehicle.fields.realPower', property: 'realPower', visible: true, type: 'text' },
            { label: 'entities.vehicle.fields.seatingCapacity', property: 'seatingCapacity', visible: true, type: 'text' },
        ],
       
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [

        ],
        renderItem: (element: Vehicle, property: keyof Vehicle) => {

            return element[property];
        },
    };
    data: Vehicle[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Vehicle> = new MatTableDataSource();
    selection = new SelectionModel<Vehicle>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _vehicleService: VehicleService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this._vehicleService.vehicles$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: Vehicle[]) => {
                this.data = data;
                this.dataSource.data = data;
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

    /**
        * Edit Vehicle Vehicle
        */
    onDemand(item: Vehicle | null): void {

    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<Vehicle>) {
        return column.property;
    }
}