import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Product } from "@core/services/settings/product/product.interface";
import { LotAttestation } from "@core/services/attestations/lot-attestation/lot-attestation.interface";
import { LotAttestationsService } from "@core/services/attestations/lot-attestation/lot-attestation.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { LotAttestationsNewComponent } from "../new/new.component";

@Component({
    selector: "app-attestations-list",
    templateUrl: "./list.component.html",
    styles: `
        /* Chrome, Safari, Edge, Opera */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        /* Firefox */
        input[type=number] {
            -moz-appearance: textfield;
        }
        
        /* width */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        /* Track */
        ::-webkit-scrollbar-track {
            @apply bg-default;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
            @apply bg-primary-500; 
        }
        
        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            @apply bg-primary;
        }
    `,
    animations: animations
})
export class LotAttestationsListComponent {
    openSelection() {
        throw new Error('Method not implemented.');
    }

    searchCtrl: UntypedFormControl = new UntypedFormControl('');
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<LotAttestation> = {
        title: '',
        columns: [
            { label: 'entities.lot_attestations.fields.prefix', property: 'prefix', type: 'text', visible: true },
            { label: 'entities.lot_attestations.fields.quantity', property: 'quantity', type: 'text', visible: true },
            { label: 'entities.lot_attestations.fields.stock', property: 'stock', type: 'text', visible: true },
            { label: 'entities.lot_attestations.fields.startDate', property: 'startDate', type: 'text', visible: true },
            { label: 'entities.lot_attestations.fields.endDate', property: 'endDate', type: 'text', visible: true },
            { label: 'entities.lot_attestations.fields.status', property: 'status', type: 'text', visible: true },
        ],
        imageOptions: {
            label: 'coverage.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [

        ],
        renderItem: (element: LotAttestation, property: keyof LotAttestation) => {
          
            if (property === 'startDate' || property === 'endDate') {
                return element[property] ? new Date(element[property]).toLocaleDateString() : '';
            }
            return element[property];
        },
    };
    data: LotAttestation[] = [
        // Example data, replace with actual data from service
        {
            id: '1',
            managementEntity: 'Entity 1',
            product: 'TPV',
            prefix: 'AA4',
            pileStart: 100,
            pileEnd: 200,
            quantity: 1250,
            stock: 341,
            status: 'active',
            startDate: new Date("2023-01-01"),
            endDate: new Date("2023-12-31"),
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '2',
            managementEntity: 'Entity 2',
            product: 'TPV',
            prefix: 'AA5',
            pileStart: 300,
            pileEnd: 400,
            quantity: 1500,
            stock: 120,
            status: 'inactive',
            startDate: new Date("2023-02-01"),
            endDate: new Date("2023-11-30"),
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<LotAttestation> = new MatTableDataSource();
    selection = new SelectionModel<LotAttestation>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: Product = {} as Product;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _lotAttestationService: LotAttestationsService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        // this._lotAttestationService.lotAttestations$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((data: LotAttestation[]) => {
        //         // this.data = data;
        //         // this.dataSource.data = data;
        //         // this._changeDetectorRef.detectChanges();
        //     });

        this.dataSource = new MatTableDataSource<LotAttestation>(this.data);
        this.dataSource.paginator = this.paginator;
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
        * Edit LotAttestation LotAttestation
        */
    openCreate(): void {
        this._lotAttestationService.lotAttestation = {} as LotAttestation;
        const dialogRef = this._dialog.open(LotAttestationsNewComponent, {
            panelClass: 'app-lot-attestations-new',
            data: {
                lotAttestation: {} as LotAttestation,
                selectedProduct: this.selectedProduct
            },
        });
        dialogRef.afterClosed().subscribe((response) => {
            if (response) {
                this._lotAttestationService.create(response).subscribe();
            }
        });
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<LotAttestation>) {
        return column.property;
    }
}