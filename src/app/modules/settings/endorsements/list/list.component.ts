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
import { Endorsment } from "@core/services/settings/endorsement/endorsement.interface";
import { EndorsementService } from "@core/services/settings/endorsement/endorsement.service";
import { EndorsementNewComponent } from "../new/new.component";
import { MatDialog } from "@angular/material/dialog";
import { AssignProductComponent } from "../assign-product/assign-product.component";
import { Product } from "@core/services/settings/product/product.interface";

@Component({
    selector: "app-closures-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class EndorsementListComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<Endorsment> = {
        title: '',
        columns: [
            { label: 'entities.endorsment.fields.name', property: 'name', visible: true, type: 'text' },
            { label: 'entities.endorsment.fields.nature', property: 'nature', visible: true, type: 'text' },
        ],
        imageOptions: {
            label: 'closure.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: Endorsment, property: keyof Endorsment) => {

            if (property === 'nature') {
                return this._translateService.translate(`entities.endorsment.options.nature.${element.nature}`);
            }

            return element[property];
        },
    };
    data: Endorsment[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    searchCtrl: UntypedFormControl = new UntypedFormControl('');
    dataSource: MatTableDataSource<Endorsment> = new MatTableDataSource();
    selection = new SelectionModel<Endorsment>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _translateService: TranslocoService,
        private _router: Router,
        private _endorsmentService: EndorsementService,
        private _layoutService: LayoutService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this._endorsmentService.endorsements$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: Endorsment[]) => {
                this.data = data;
                console.log('Endorsements data:', this.data);
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

    assignProduct(item: Endorsment): void {
        this._endorsmentService.get(item.id).subscribe(fullEndorsement => {
            const onlyFleet = ['RETRACT', 'INCORPORATION'].includes(fullEndorsement.nature);

            this._dialog.open(AssignProductComponent, {
            width: '600px',
            data: {
                endorsmentId: fullEndorsement.id,
                assignedProducts: fullEndorsement.product ?? [],
                onlyFleetProducts: onlyFleet,            // 👈 on passe le flag
                nature: fullEndorsement.nature          // (optionnel, si tu veux l’afficher)
            }
            }).afterClosed().subscribe((selectedProducts: Product[]) => {
            const productIds = selectedProducts?.map(p => typeof p === 'string' ? p : p.id) ?? [];
            if (productIds.length) {
                this._endorsmentService.assignProducts(fullEndorsement.id, productIds).subscribe({
                next: () => console.log('Produits assignés avec succès'),
                error: (err) => console.error('Erreur lors de l’assignation :', err)
                });
            }
            });
        });
    }

    onDelete(endorsement: Endorsment): void {}

    onEdit(endorsement: Endorsment): void {
        this._layoutService.setSelectedEndorsement(endorsement);
        this._dialog.open(EndorsementNewComponent, {
            width: '600px',
            data: { 
                mode: 'edit',
                endorsement: endorsement
            }
        });
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<Endorsment>) {
        return column.property;
    }

    openAddDialog() {
        this._dialog.open(EndorsementNewComponent, {
            width: '600px',
            maxWidth: '90vw',
            data: {
                mode: 'create',
                endorsement: null
            }
        });
    }
}