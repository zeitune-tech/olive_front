import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { InsuredRegistry } from "@core/services/settings/insured-registry/insured-registry.interface";
import { InsuredRegistryService } from "@core/services/settings/insured-registry/insured-registry.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-insured-registries-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class InsuredRegistriesListComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<InsuredRegistry> = {
        title: '',
        columns: [
            { label: 'entities.insured_registry.fields.prefix', property: 'prefix', type: 'text', visible: true },
            { label: 'entities.insured_registry.fields.length', property: 'length', type: 'text', visible: true },
            { label: 'entities.insured_registry.fields.counter', property: 'counter', type: 'text', visible: true },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: InsuredRegistry, property: keyof InsuredRegistry) => {

            return element[property];
        },
    };
    data: InsuredRegistry[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<InsuredRegistry> = new MatTableDataSource();
    selection = new SelectionModel<InsuredRegistry>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _insuredRegistryService: InsuredRegistryService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this._insuredRegistryService.insuredRegistries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: InsuredRegistry[]) => {
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

    onEdit(insuredRegistry: InsuredRegistry): void {}
    onView(insuredRegistry: InsuredRegistry): void {}
    onDelete(insuredRegistry: InsuredRegistry): void {}

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<InsuredRegistry>) {
        return column.property;
    }
}