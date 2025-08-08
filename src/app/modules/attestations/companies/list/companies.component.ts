import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Product } from "@core/services/settings/product/product.interface";
import { CompanyAttestations } from "@core/services/attestations/company-attestations/company-attestations.interface";
import { CompanyAttestationsService } from "@core/services/attestations/company-attestations/company-attestations.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { CompanyAttestationsNewComponent } from "../new/new.component";
import { SelectDialogComponent } from "@shared/components/select-dialog/select-dialog.component";
import { MarketLevelOrganizationAttestations } from "@core/services/attestations/market-level-organization-attestations/market-level-organization-attestation.interface";
import { LotAttestationsService } from "@core/services/attestations/lot-attestation/lot-attestation.service";
import { LotAttestation } from "@core/services/attestations/lot-attestation/lot-attestation.interface";

@Component({
    selector: "app-companies-attestations",
    templateUrl: "./companies.component.html",
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
export class CompaniesAttestationsComponent {
    openSelection() {
        throw new Error('Method not implemented.');
    }

    searchCtrl: UntypedFormControl = new UntypedFormControl('');
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<CompanyAttestations> = {
        title: '',
        columns: [
            { label: 'entities.lot_attestations.fields.prefix', property: 'prefix', type: 'text', visible: true },
            { label: 'entities.lot_attestations.fields.quantity', property: 'quantity', type: 'text', visible: true },
            { label: 'entities.lot_attestations.fields.stock', property: 'stock', type: 'text', visible: true },
            { label: 'entities.lot_attestations.fields.start_date', property: 'startDate', type: 'text', visible: true },
            { label: 'entities.lot_attestations.fields.end_date', property: 'endDate', type: 'text', visible: true },
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
        renderItem: (element: CompanyAttestations, property: keyof CompanyAttestations) => {

            return element[property];
        },
    };
    data: CompanyAttestations[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<CompanyAttestations> = new MatTableDataSource();
    selection = new SelectionModel<CompanyAttestations>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: Product = {} as Product;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _lotAttestationService: CompanyAttestationsService,
        private _attestationService: LotAttestationsService,
        private _dialog: MatDialog
    ) { }

    attestations!: LotAttestation[];
    selectedAttestation!: LotAttestation;

    ngOnInit(): void {
        this._attestationService.lotAttestations$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: LotAttestation[]) => {
                this.attestations = data;
                this.selectedAttestation 
            });

        this._lotAttestationService.companyAttestations$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: CompanyAttestations[]) => {
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
        * Edit CompanyAttestations CompanyAttestations
        */
    openCreate(): void {
        const dialogRef = this._dialog.open(CompanyAttestationsNewComponent, {
            panelClass: 'app-lot-attestations-new',
            data: {
                lotAttestation: {} as CompanyAttestations,
                selectedProduct: this.selectedProduct
            },
        });
        dialogRef.afterClosed().subscribe((response) => {
            if (response) {
                this._lotAttestationService.create(response).subscribe();
            }
        });
    }


    openAttestationSelection(): void {
        this._dialog.open(SelectDialogComponent, {
            data: {
                title: 'Select Attestation',
                items: this.attestations,
                displayField: 'prefix',
            }
        }).afterClosed().subscribe((selectedAttestation: any) => {
            if (selectedAttestation) {
                this.selectedProduct = selectedAttestation;
                // this._lotAttestationService.setSelectedProduct(selectedAttestation);
            }
        })
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<CompanyAttestations>) {
        return column.property;
    }
}