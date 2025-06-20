import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { TaxService } from "@core/services/settings/tax/tax.service";
import { Tax } from "@core/services/settings/tax/tax.interface";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-taxs-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class TaxesListComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<Tax> = {
        title: '',
        columns: [
            { label: 'entities.tax.fields.designation', property: 'designation', type: 'text', visible: true },
            { label: 'entities.tax.fields.nature', property: 'nature', type: 'text', visible: true },
            { label: 'entities.tax.fields.rgr', property: 'rgr', type: 'text', visible: true },
        ],
        imageOptions: {
            label: 'tax.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: Tax, property: keyof Tax) => {


            return element[property];
        },
    };
    data: Tax[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Tax> = new MatTableDataSource();
    selection = new SelectionModel<Tax>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _taxService: TaxService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this._taxService.taxes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: Tax[]) => {
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

    onEdit(element: Tax): void {}
    onDelete(element: Tax): void {
        // Implement delete logic here
    }
    onView(element: Tax): void {
        // Implement view logic here
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<Tax>) {
        return column.property;
    }
}