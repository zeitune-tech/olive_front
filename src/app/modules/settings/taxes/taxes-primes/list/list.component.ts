import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Product } from "@core/services/settings/product/product.interface";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { TranslocoService } from "@jsverse/transloco";
import { SelectProductComponent } from "../../../coverages/select-product/select-product.component";
import { TaxPrime } from "@core/services/settings/tax-primes/tax-primes.interface";
import { TaxPrimeService } from "@core/services/settings/tax-primes/tax-primes.service";
import { PrimesFormComponent } from "../form/form.component";

@Component({
    selector: "app-taxes-prime-list",
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
export class PrimesListComponent {
    searchCtrl: UntypedFormControl = new UntypedFormControl('');
    private _unsubscribeAll: Subject<any> = new Subject<any>();

   

    tableOptions: TableOptions<TaxPrime> = {
        title: '',
        columns: [
            {
                property: 'taxType',
                visible: true,
                label: ('entities.tax.fields.taxType'),
                type: 'text',
            },
            {
                property: 'coverage',
                visible: true,
                label: ('entities.tax.fields.coverage'),
                type: 'text',
            },
          
            {
                property: 'isFlatRate',
                visible: true,
                label: ('entities.tax.fields.isFlatRate'),
                type: 'text',
            },
            {
                property: 'flatRateAmount',
                visible: true,
                label: ('entities.tax.fields.flatRateAmount'),
                type: 'text',
            },
            {
                property: 'rate',
                visible: true,
                label: ('entities.tax.fields.rate'),
                type: 'text',
            },
              {
                property: 'dateEffective',
                visible: true,
                label: ('entities.tax.fields.dateEffective'),
                type: 'text',
            },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: TaxPrime, property: keyof TaxPrime) => {
            if (property === 'product') {
                return element.product.name; // Affiche le nom du produit associé
            } else if (property === 'taxType') {
                return element.taxType.name; // Affiche le nom du type de taxe
            } else if (property === 'calculationBase') {
                return 'entities.taxes-prime.calculation-base. + element.calculation-base';
            }
            return element[property];
        }
    };
    data: TaxPrime[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<TaxPrime> = new MatTableDataSource();
    selection = new SelectionModel<TaxPrime>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: Product = {} as Product;
    products: Product[] = [];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _taxPrimeService: TaxPrimeService,
        private _translateService: TranslocoService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.buildHeaders();

        this._taxPrimeService.taxPrimes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: TaxPrime[]) => {


                this.products = data
                    .map(TaxPrime => TaxPrime.product)
                    .filter((product, index, self) =>
                        index === self.findIndex((p) => p.id === product.id)
                    );

                this.selectedProduct = this.products[0] || {} as Product;
                this.data = data;
                this.dataSource.data = data;
                this.dataSource.data = this.data.filter(taxPrime => taxPrime.product.id === this.selectedProduct.id);
                this._changeDetectorRef.detectChanges();
            });

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    groupHeader: string[] = [];
    subHeader: string[] = [];
    visibleColumns: string[] = [];

    buildHeaders(): void {
        this.tableOptions.columns.forEach(col => {
            if (col.type === 'collapse' && col.collapseOptions?.length) {
                // En-tête parent (ligne 1)
                const parent = col.property as string + '-parent';
                this.groupHeader.push(parent);

                // Sous-colonnes (ligne 2)
                col.collapseOptions.forEach(child => {
                    this.subHeader.push(child.property as string);
                    this.visibleColumns.push(child.property as string);
                });
            } else {
                // Colonne simple (même valeur dans les 2 lignes)
                this.groupHeader.push(col.property as string);
                
                this.visibleColumns.push(col.property as string);
            }
        });

        // Ajout de la colonne d’actions si nécessaire
        this.groupHeader.push('actions');
        this.visibleColumns.push('actions');
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

    openSelection() {
        this._dialog.open(SelectProductComponent, {
            width: '700px',
            data: {
                selected: this.selectedProduct,
                products: this.products
            }
        }).afterClosed().subscribe((product: Product) => {
            if (product) {
                this.selectedProduct = product;
                // this.dataSource.data = this.data.filter(TaxPrime => TaxPrime.product.id === this.selectedProduct.id);
                this.dataSource.paginator = this.paginator;
                this._changeDetectorRef.detectChanges();
            }
        })
    }

    openAddDialog(): void {
        this._dialog.open(PrimesFormComponent, {
            width: '700px',
            data: {
                mode: 'create',
                data: {} as TaxPrime
            }
        }).afterClosed().subscribe((result: TaxPrime) => {
            if (result) {
                this.data.push(result);
                this.dataSource.data = this.data;
                this._changeDetectorRef.detectChanges();
            }
        })
    }

    openEditDialog(item: any): void {
        const dialogRef = this._dialog.open(PrimesFormComponent, {
            width: '700px',
            data: {
                mode: 'edit',
                data: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const index = this.data.findIndex(t => t.id === result.id);
                if (index !== -1) {
                    this.data[index] = result;
                    this.dataSource.data = this.data;
                    this._changeDetectorRef.detectChanges();
                }                
            }
        });
    }

    openDeleteDialog(item: any): void { }

    // onView(element: TaxPrime): void {
    //     this.openEditDialog(element);
    // }
    
    onDelete(element: TaxPrime): void {
        // this._TaxPrimeService.delete(element.id).subscribe(() => {
        //     this.data = this.data.filter(item => item.id !== element.id);
        //     this.dataSource.data = this.data;
        //     this._changeDetectorRef.detectChanges();
        // });
    }

    trackByProperty(index: number, column: TableColumn<TaxPrime>) {
        return column.property;
    }
}