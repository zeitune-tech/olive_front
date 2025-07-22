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
import { TaxType } from "@core/services/settings/tax-type/tax-type.interface";
import { SelectProductComponent } from "../../../coverages/select-product/select-product.component";
import { TaxTypeService } from "@core/services/settings/tax-type/tax-type.service";
import { TypeFormComponent } from "../form/form.component";

@Component({
    selector: "app-taxes-type-list",
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
export class TypeListComponent {
    searchCtrl: UntypedFormControl = new UntypedFormControl('');
    private _unsubscribeAll: Subject<any> = new Subject<any>();

   

    tableOptions: TableOptions<TaxType> = {
        title: '',
        columns: [
                {
                    property: 'name',
                    type: 'text',
                    label:  'entities.tax-type.fields.name',
                    visible: true,
                },
                {
                    property: 'nature',
                    type: 'text',
                    label: 'entities.tax-type.fields.nature',
                    visible: true,
                },
               
        ],
        imageOptions: {
            label: 'tax-type.table.column.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: TaxType, property: keyof TaxType) => {
            if (property === 'nature') {
                return 'entities.tax-type.nature' + element.nature;
            }
            return element[property];
        },
    };
    data: TaxType[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<TaxType> = new MatTableDataSource();
    selection = new SelectionModel<TaxType>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: Product = {} as Product;
    products: Product[] = [];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _taxTypeService: TaxTypeService,
        private _translateService: TranslocoService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.buildHeaders();

        this._taxTypeService.taxTypes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: TaxType[]) => {


                // this.products = data
                //     .map(taxType => taxType.)
                //     .filter((product, index, self) =>
                //         index === self.findIndex((p) => p.id === product.id)
                //     );

                this.selectedProduct = this.products[0] || {} as Product;
                this.data = data;
                // this.dataSource.data = data;
                // this.dataSource.data = this.data.filter(TaxType => TaxType.product.id === this.selectedProduct.id);
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
                // this.dataSource.data = this.data.filter(taxType => taxType.product.id === this.selectedProduct.id);
                this.dataSource.paginator = this.paginator;
                this._changeDetectorRef.detectChanges();
            }
        })
    }

    openAddDialog(): void {
        this._dialog.open(TypeFormComponent, {
            width: '700px',
            data: {
                mode: 'add',
                product: this.selectedProduct,
            }
        }).afterClosed().subscribe((result: TaxType) => {
            if (result) {
                
            }
        })
    }

    // openEditDialog(item: any): void {
    //     const dialogRef = this._dialog.open(TaxTypesEditDialogComponent, {
    //         width: '700px',
    //         data: item
    //     });

    //     dialogRef.afterClosed().subscribe(result => {
    //         if (result) {
    //             // Appeler ici le service pour mettre à jour les données
    //             this._taxTypeService.update(item.id, result).subscribe(() => {
    //                 // rechargement, toast, etc.
    //                 this._taxTypeService.getAll().subscribe((data: TaxType[]) => {
    //                     this.data = data;
    //                     this.dataSource.data = data;
    //                     this._changeDetectorRef.detectChanges();
    //                 });
    //             });
    //         }
    //     });
    // }

    openDeleteDialog(item: any): void { }

    // onView(element: TaxType): void {
    //     this.openEditDialog(element);
    // }
    
    onDelete(element: TaxType): void {
        // this._taxTypeService.delete(element.id).subscribe(() => {
        //     this.data = this.data.filter(item => item.id !== element.id);
        //     this.dataSource.data = this.data;
        //     this._changeDetectorRef.detectChanges();
        // });
    }

    trackByProperty(index: number, column: TableColumn<TaxType>) {
        return column.property;
    }
}