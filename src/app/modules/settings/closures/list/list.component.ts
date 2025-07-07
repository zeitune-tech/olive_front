import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Closure } from "@core/services/settings/closure/closure.interface";
import { ClosureService } from "@core/services/settings/closure/closure.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-closures-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class ClosuresListComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<Closure> = {
        title: '',
        columns: [
            { label: 'entities.closure.fields.type', property: 'type', type: 'text', visible: true },
            { label: 'entities.closure.fields.date', property: 'date', type: 'text', visible: true },
            { label: 'entities.closure.fields.managementEntity', property: 'managementEntity', type: 'text', visible: true },
            { label: 'entities.closure.fields.product', property: 'product', type: 'text', visible: true }
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: Closure, property: keyof Closure) => {

            return element[property];
        },
    };
    data: Closure[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Closure> = new MatTableDataSource();
    selection = new SelectionModel<Closure>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private dclosureService: ClosureService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.dclosureService.closures$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: Closure[]) => {
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

    onEdit(closure: Closure): void {}
    onView(closure: Closure): void {}
    onDelete(closure: Closure): void {}
    
    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<Closure>) {
        return column.property;
    }
}