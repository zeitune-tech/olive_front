import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Accessory } from "@core/services/settings/accessory/accessory.interface";
import { AccessoryService } from "@core/services/settings/accessory/accessory.service";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { LayoutService } from "../layout.service";
import { MatDialog } from "@angular/material/dialog";
import { AccessoryNewComponent } from "../new/new.component";

@Component({
    selector: "app-closures-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class AccessoriesListComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<Accessory> = {
        title: '',
        columns: [
            { label: 'entities.accessory.fields.dateEffective', property: 'dateEffective', visible: true, type: 'text' },
            { label: 'entities.accessory.fields.actType', property: 'actType', visible: true, type: 'text' },
            { label: 'entities.accessory.fields.product', property: 'product', visible: true, type: 'text' },
            { label: 'entities.accessory.fields.accessoryRisk', property: 'accessoryRisk', visible: true, type: 'text' },
            { label: 'entities.accessory.fields.accessoryPolice', property: 'accessoryPolice', visible: true, type: 'text' },
            { label: 'entities.accessory.fields.effectiveDate', property: 'effectiveDate', visible: true, type: 'text' }
        ],
        imageOptions: {
            label: 'closure.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: Accessory, property: keyof Accessory) => {

            if (property === 'product') {
                return element.product?.name;
            }

            if (property === 'actType') {
                return element.actType?.name;
            }

            if (property === 'effectiveDate') {
                const day = element.day || '';
                const hour = element.hour?.toString().padStart(2, '0') || '00';
                const minute = element.minute?.toString().padStart(2, '0') || '00';

                return day ? `${day} ${hour}:${minute}` : '';
            }
            
            return element[property];
        },
    };
    data: Accessory[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    searchCtrl: UntypedFormControl = new UntypedFormControl('');
    dataSource: MatTableDataSource<Accessory> = new MatTableDataSource();
    selection = new SelectionModel<Accessory>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _accessoryService: AccessoryService,
        private _translateService: TranslocoService,
        private _router: Router,
        private _layoutService: LayoutService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this._accessoryService.accessories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: Accessory[]) => {
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

    onView(item: Accessory): void {}

    onDelete(accessory: Accessory): void {}

    onEdit(accessory: Accessory): void {
        this._layoutService.setSelectedAccessory(accessory);
        this._dialog.open(AccessoryNewComponent, {
            width: '600px',
            data: { accessory }
        });
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    openAddDialog() {
        this._dialog.open(AccessoryNewComponent, {
            width: '600px',
            maxWidth: '90vw',
            data: { accessory: this.searchCtrl.value }
        });
    }

    trackByProperty(index: number, column: TableColumn<Accessory>) {
        return column.property;
    }
}