import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PointOfSale } from "@core/services/point-of-sale/point-of-sale.interface";
import { PointOfSaleService } from "@core/services/point-of-sale/point-of-sale.service";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableColumn, TableOptions } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { AttestationAttributeComponent } from "../../attestations/attribute/attribute.component";

@Component({
    selector: "app-points-of-sale-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class PointsOfSaleListComponent {

    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<PointOfSale> = {
        title: '',
        columns: [
            { label: 'point-of-sale.columns.name', property: 'name', type: 'text', visible: true },
            { label: 'point-of-sale.columns.email', property: 'email', type: 'text', visible: true },
            { label: 'point-of-sale.columns.phone', property: 'phone', type: 'text', visible: true },
            { label: 'point-of-sale.columns.address', property: 'address', type: 'text', visible: true },
            { label: 'point-of-sale.columns.type', property: 'type', type: 'text', visible: true },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
            { label: 'point-of-sale.actions.edit', icon: 'edit', action: this.editItem.bind(this) },
            { label: 'point-of-sale.actions.delete', icon: 'delete', action: this.deleteItem.bind(this) },
            { label: 'point-of-sale.actions.attribute-attestation', icon: 'delete', action: this.attribute.bind(this) }
        ],
        renderItem: (element: PointOfSale, property: keyof PointOfSale) => {
            if (property === 'type') {
                return this._translateService.translate(`point-of-sale.types.${element[property]}`);
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
        private _translateService: TranslocoService ,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._pointOfSaleService.pointsOfSaleLinked$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: PointOfSale[]) => {
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

    attribute(item: PointOfSale | null): void {
        this._dialog.open(AttestationAttributeComponent, {
            data: {
                assignTo: item
            }
        }).afterClosed().subscribe((result) => {
            if (result) {
                
            }
        });
    }

    /**
        * Edit PointOfSale PointOfSale
        */
    editItem(item: PointOfSale | null): void {
        
    }

    /**
        * Delete PointOfSale PointOfSale
        */
    deleteItem(item: PointOfSale): void {
        
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<PointOfSale>) {
        return column.property;
    }
}