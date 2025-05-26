import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Commission } from "@core/services/settings/commission/commission.interface";
import { CommissionService } from "@core/services/settings/commission/commission.service";
import { DurationRate } from "@core/services/settings/duration-rate/duration-rate.interface";
import { DurationRateService } from "@core/services/settings/duration-rate/duration-rate.service";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-duration-rate-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class DurationRateListComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<DurationRate> = {
        title: '',
        columns: [
            { label: 'entities.duration_rate.fields.dateEffective', property: 'dateEffective', type: 'text', visible: true },
            { label: 'entities.duration_rate.fields.duration', property: 'duration', type: 'text', visible: true },
            { label: 'entities.duration_rate.fields.rate', property: 'rate', type: 'text', visible: true },
            { label: 'entities.duration_rate.fields.product', property: 'product', type: 'text', visible: true },   
        ],
        imageOptions: {
            label: 'closure.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [

        ],
        renderItem: (element: DurationRate, property: keyof DurationRate) => {

            if (property === 'duration') {
                let duration: string = element.duration.from.toString();
                if (element.duration.type !== "FIXED") {
                    duration += ' - ' + element.duration.to;
                }
                let unit =this._translationService.translate('entities.duration_rate.options.unit.' + element.duration.unit);
                return `${duration} ${unit}`;
            }

            if (property === 'product') {
                return element.product ? element.product.name : '-';
            }

            return element[property];
        },
    };
    data: DurationRate[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<DurationRate> = new MatTableDataSource();
    selection = new SelectionModel<DurationRate>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _durationRateService: DurationRateService,
        private _translationService: TranslocoService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this._durationRateService.durationRates$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: DurationRate[]) => {
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
        * Edit Commission Commission
        */
    onDemand(item: DurationRate | null): void {

    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<DurationRate>) {
        return column.property;
    }
}