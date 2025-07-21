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
import { TaxExemption } from "@core/services/settings/tax-exemption/tax-exemption.interface";
import { ExemptionFormComponent } from "../form/form.component";
import { TaxExemptionService } from "@core/services/settings/tax-exemption/tax-exemption.service";

@Component({
    selector: "app-TaxExemptions-list",
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
export class ExemptionListComponent {
    searchCtrl: UntypedFormControl = new UntypedFormControl('');
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<TaxExemption> = {} as TableOptions<TaxExemption>;
    data: TaxExemption[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<TaxExemption> = new MatTableDataSource();
    selection = new SelectionModel<TaxExemption>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: Product = {} as Product;
    products: Product[] = [];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _TaxExemptionService: TaxExemptionService,
        private _translateService: TranslocoService,
        private _dialog: MatDialog
    ) { }

    initializeTableOptions(): void {
        this.tableOptions = {
            title: '',
            columns: [
               { property: 'name', type: 'text', label: 'entities.tax-exemption.fields.name', visible: true },
               { property: 'taxes', type: 'text', label: 'entities.tax-exemption.fields.taxes', visible: true },
            ],
            pageSize: 8,
            pageSizeOptions: [5, 6, 8],
            actions: [],
            renderItem: (element: TaxExemption, property: keyof TaxExemption) => {
                if (property === 'product') {
                    return element.product.name; // Affiche le nom du produit associé
                } else if (property === 'taxes') {
                    return element.taxes.map(tax => tax.designation).join(', '); // Affiche les noms des taxes associés
                }
                return element[property];
            }
        };
    }

    ngOnInit(): void {
        this.initializeTableOptions();
        this.buildHeaders();

        this._TaxExemptionService.taxExemptions$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: TaxExemption[]) => {

                this.products = data
                    .map(TaxExemption => TaxExemption.product)
                    .filter((product, index, self) =>
                        index === self.findIndex((p) => p.id === product.id)
                    );

                this.selectedProduct = this.products[0] || {} as Product;
                this.data = data;
                this.dataSource.data = data;
                this.dataSource.data = this.data.filter(TaxExemption => TaxExemption.product.id === this.selectedProduct.id);
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
                // this.dataSource.data = this.data.filter(TaxExemption => TaxExemption.product.id === this.selectedProduct.id);
                this.dataSource.paginator = this.paginator;
                this._changeDetectorRef.detectChanges();
            }
        })
    }

    openAddDialog(): void {
        this._dialog.open(ExemptionFormComponent, {
            width: '700px',
            data: {
                mode: 'add',
                product: this.selectedProduct,
            }
        }).afterClosed().subscribe((result: TaxExemption) => {
            if (result) {
                
            }
        })
    }

    // openEditDialog(item: any): void {
    //     const dialogRef = this._dialog.open(TaxExemptionsEditDialogComponent, {
    //         width: '700px',
    //         data: item
    //     });

    //     dialogRef.afterClosed().subscribe(result => {
    //         if (result) {
    //             // Appeler ici le service pour mettre à jour les données
    //             this._TaxExemptionService.update(item.id, result).subscribe(() => {
    //                 // rechargement, toast, etc.
    //                 this._TaxExemptionService.getAll().subscribe((data: TaxExemption[]) => {
    //                     this.data = data;
    //                     this.dataSource.data = data;
    //                     this._changeDetectorRef.detectChanges();
    //                 });
    //             });
    //         }
    //     });
    // }

    openDeleteDialog(item: any): void { }

    // onView(element: TaxExemption): void {
    //     this.openEditDialog(element);
    // }
    
    onDelete(element: TaxExemption): void {
        // this._TaxExemptionService.delete(element.id).subscribe(() => {
        //     this.data = this.data.filter(item => item.id !== element.id);
        //     this.dataSource.data = this.data;
        //     this._changeDetectorRef.detectChanges();
        // });
    }

    trackByProperty(index: number, column: TableColumn<TaxExemption>) {
        return column.property;
    }
}