    import { SelectionModel } from "@angular/cdk/collections";
    import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
    import { UntypedFormControl } from "@angular/forms";
    import { MatDialog } from "@angular/material/dialog";
    import { MatPaginator } from "@angular/material/paginator";
    import { MatSort } from "@angular/material/sort";
    import { MatTableDataSource } from "@angular/material/table";
    import { Demand } from "@core/services/demand/demand.interface";
    import { DemandService } from "@core/services/demand/demand.service";
    import { TableColumn, TableOptions } from "@lhacksrt/components/table/table.interface";
    import { Subject, takeUntil } from "rxjs";

    @Component({
        selector: "app-demands-list",
        templateUrl: "./list.component.html",
    })
    export class DemandsListComponent {
    
    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<Demand> = {
        title: '',
        columns: [
            
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
            { label: 'company.actions.edit', icon: 'edit', action: this.editItem.bind(this) },
            { label: 'company.actions.delete', icon: 'delete', action: this.deleteItem.bind(this) }
        ],
        renderItem: (element: Demand, property: keyof Demand) => {
            
            return element[property];
        },
    };
    data: Demand[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Demand> = new MatTableDataSource();
    selection = new SelectionModel<Demand>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _demandService: DemandService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._demandService.demands$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Demand[]) => {
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
        * Edit Demand Demand
        */
    editItem(item: Demand | null): void {
        
    }

    /**
        * Delete Demand Demand
        */
    deleteItem(item: Demand): void {
        
    }

    get visibleColumns() {
        return this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
    }

    trackByProperty(index: number, column: TableColumn<Demand>) {
        return column.property;
    }
}