import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PointOfSale } from "@core/services/administration/point-of-sale/point-of-sale.interface";
import { PointOfSaleService } from "@core/services/administration/point-of-sale/point-of-sale.service";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableColumn, TableOptions } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { PointOfSaleEditComponent } from "../edit/edit.component";
import { ConfirmDeleteComponent } from "@shared/components/confirm-delete/confirm-delete.component";

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
            { label: 'entities.point_of_sale.fields.name', property: 'name', type: 'text', visible: true },
            { label: 'entities.point_of_sale.fields.email', property: 'email', type: 'text', visible: true },
            { label: 'entities.point_of_sale.fields.phone', property: 'phone', type: 'text', visible: true },
            { label: 'entities.point_of_sale.fields.address', property: 'address', type: 'text', visible: true },
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
        private _translateService: TranslocoService ,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._pointOfSaleService.pointsOfSale$
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

    onEdit(element: PointOfSale): void {
        this._dialog.open(PointOfSaleEditComponent, {
            width: '600px',
            data: element
        }).afterClosed().subscribe(result => {
            if (result) {
                // rafraîchir la liste ou afficher une notification de succès
            }
        });

    }
    
    onDelete(element: PointOfSale): void {
        const dialogRef = this._dialog.open(ConfirmDeleteComponent, {
            width: '400px',
            data: {
                title: 'form.actions.deleteTitle',
                message: 'form.actions.deleteMessage',
                itemName: element.name
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._pointOfSaleService.delete(element.id).subscribe({
                    next: () => {
                        this._pointOfSaleService.getAll().subscribe();
                    },
                    error: () => {
                        this._dialog.open(ConfirmDeleteComponent, {
                            width: '400px',
                            data: {
                                title: 'form.errors.title',
                                message: 'form.errors.message',
                                itemName: element.name,
                                isErrorOnly: true
                            }
                        });
                    }
                });
            }
        });
    }

    onView(element: PointOfSale): void {
        // Implement view logic here
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