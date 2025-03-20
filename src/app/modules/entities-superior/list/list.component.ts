    import { SelectionModel } from "@angular/cdk/collections";
    import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
    import { UntypedFormControl } from "@angular/forms";
    import { MatDialog } from "@angular/material/dialog";
    import { MatPaginator } from "@angular/material/paginator";
    import { MatSort } from "@angular/material/sort";
    import { MatTableDataSource } from "@angular/material/table";
    import { EntitySuperior } from "@core/services/entity-superior/entity-superior.interface";
    import { EntitySuperiorService } from "@core/services/entity-superior/entity-superior.service";
import { animations } from "@lhacksrt/animations";
    import { TableColumn, TableOptions } from "@lhacksrt/components/table/table.interface";
    import { Subject, takeUntil } from "rxjs";

    @Component({
        selector: "app-entity-superior-list",
        templateUrl: "./list.component.html",
        animations: animations
    })
    export class EntitySuperiorListComponent { 

    
    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<EntitySuperior> = {
        title: '',
        columns: [
            { label: 'company.columns.logo', property: 'logo', type: 'image', visible: true },
            { label: 'entity-superior.columns.name', property: 'name', type: 'text', visible: true},
            { label: 'entity-superior.columns.email', property: 'email', type: 'text', visible: true},
            { label: 'entity-superior.columns.phone', property: 'phone', type: 'text', visible: true},
            { label: 'entity-superior.columns.address', property: 'address', type: 'text', visible: true},
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
            { label: 'entity-superior.actions.demand', icon: 'message', action: this.editItem.bind(this), cssClasses: ['bg-primary-200', 'text-primary'] },
        ],
        imageOptions: {
            label: 'company.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        renderItem: (element: EntitySuperior, property: keyof EntitySuperior) => {
            
            return element[property];
        },
    };
    data: EntitySuperior[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<EntitySuperior> = new MatTableDataSource();
    selection = new SelectionModel<EntitySuperior>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _entitySuperiorService: EntitySuperiorService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._entitySuperiorService.entitiesSuperior$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((entitiesSuperior: EntitySuperior[]) => {
            this.data = entitiesSuperior;
            this.dataSource.data = entitiesSuperior;
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
    * Edit EntitySuperior EntitySuperior
    */
    editItem(item: EntitySuperior | null): void {
        
    }

    /**
    * Delete EntitySuperior EntitySuperior
    */
    deleteItem(item: EntitySuperior): void {
        
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<EntitySuperior>) {
        return column.property;
    }
}