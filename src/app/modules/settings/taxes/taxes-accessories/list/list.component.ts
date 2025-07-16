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
import { TaxAccessory } from "@core/services/settings/tax-accessory/tax-accessory.interface";
import { TaxAccessoryService } from "@core/services/settings/tax-accessory/tax-accessory.service";
import { PrimesFormComponent } from "../../taxes-primes/form/form.component";
import { AccessoriesFormComponent } from "../form/form.component";

@Component({
    selector: "app-tax-accessories-list",
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
export class AccessoriesListComponent {
    searchCtrl: UntypedFormControl = new UntypedFormControl('');
    private _unsubscribeAll: Subject<any> = new Subject<any>();

   

    tableOptions: TableOptions<TaxAccessory> = {
        title: '',
        columns: [
            { property: 'name', type: 'text', label: 'entities.tax-accessories.table.name', visible: true },
            { property: 'dateEffective', type: 'text', label: 'entities.tax-accessories.table.date-effective', visible: true },
            { property: 'calculationBase', type: 'text', label: 'entities.tax-accessories.table.calculation-base', visible: true },
            { property: 'isFlatRate', type: 'text', label: 'entities.tax-accessories.table.is-flat-rate', visible: true },
            { property: 'flatRateAmount', type: 'text', label: 'entities.tax-accessories.table.flat-rate-amount', visible: true },
            { property: 'rate', type: 'text', label: 'entities.tax-accessories.table.rate', visible: true },
            { property: 'taxType', type: 'text', label: 'entities.tax-accessories.table.tax-type', visible: true },
            { property: 'product', type: 'text', label: 'entities.tax-accessories.table.product', visible: true }
        ],
        imageOptions: {
            label: 'entities-tax-accessory.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: TaxAccessory, property: keyof TaxAccessory) => {
            if (property === 'product') {
                return element.product.name; // Affiche le nom du produit associé
            } else if (property === 'taxType') {
                return element.taxType.name; // Affiche le nom du type de taxe
            } else if (property === 'calculationBase') {
                return this._translateService.translate('entities.tax-accessory.calculation-base.' + element.calculationBase);
            }
            return element[property];
        }
    };
    data: TaxAccessory[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<TaxAccessory> = new MatTableDataSource();
    selection = new SelectionModel<TaxAccessory>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: Product = {} as Product;
    products: Product[] = [];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _TaxAccessoryService: TaxAccessoryService,
        private _translateService: TranslocoService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.buildHeaders();

        this._TaxAccessoryService.taxAccessories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: TaxAccessory[]) => {


                this.products = data
                    .map(TaxAccessory => TaxAccessory.product)
                    .filter((product, index, self) =>
                        index === self.findIndex((p) => p.id === product.id)
                    );

                this.selectedProduct = this.products[0] || {} as Product;
                this.data = data;
                this.dataSource.data = data;
                this.dataSource.data = this.data.filter(TaxAccessory => TaxAccessory.product.id === this.selectedProduct.id);
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
                // this.dataSource.data = this.data.filter(TaxAccessory => TaxAccessory.product.id === this.selectedProduct.id);
                this.dataSource.paginator = this.paginator;
                this._changeDetectorRef.detectChanges();
            }
        })
    }

    openAddDialog(): void {
        this._dialog.open(AccessoriesFormComponent, {
            width: '700px',
            data: {
                mode: 'add',
                product: this.selectedProduct,
            }
        }).afterClosed().subscribe((result: TaxAccessory) => {
            if (result) {
                
            }
        })
    }

    // openEditDialog(item: any): void {
    //     const dialogRef = this._dialog.open(TaxAccessorysEditDialogComponent, {
    //         width: '700px',
    //         data: item
    //     });

    //     dialogRef.afterClosed().subscribe(result => {
    //         if (result) {
    //             // Appeler ici le service pour mettre à jour les données
    //             this._TaxAccessoryService.update(item.id, result).subscribe(() => {
    //                 // rechargement, toast, etc.
    //                 this._TaxAccessoryService.getAll().subscribe((data: TaxAccessory[]) => {
    //                     this.data = data;
    //                     this.dataSource.data = data;
    //                     this._changeDetectorRef.detectChanges();
    //                 });
    //             });
    //         }
    //     });
    // }

    openDeleteDialog(item: any): void { }

    // onView(element: TaxAccessory): void {
    //     this.openEditDialog(element);
    // }
    
    onDelete(element: TaxAccessory): void {
        // this._TaxAccessoryService.delete(element.id).subscribe(() => {
        //     this.data = this.data.filter(item => item.id !== element.id);
        //     this.dataSource.data = this.data;
        //     this._changeDetectorRef.detectChanges();
        // });
    }

    trackByProperty(index: number, column: TableColumn<TaxAccessory>) {
        return column.property;
    }
}