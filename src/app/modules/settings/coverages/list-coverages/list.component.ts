import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Product } from "@core/services/settings/product/product.interface";
import { Coverage } from "@core/services/settings/coverage/coverage.interface";
import { CoverageService } from "@core/services/settings/coverage/coverage.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { CoveragesEditDialogComponent } from "../new-coverage/edit.component";
import { SelectProductComponent } from "../select-product/select-product.component";
import { TranslocoService } from "@jsverse/transloco";
import { CoveragesFormComponent } from "../coverages-form/coverages-form.component";

@Component({
    selector: "app-coverages-list",
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
export class CoveragesListComponent {
    searchCtrl: UntypedFormControl = new UntypedFormControl('');
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    tableOptions: TableOptions<Coverage> = {
        title: '',
        columns: [
            { label: 'entities.coverage.fields.reference', property: 'reference', type: 'text', visible: true, cssClasses: ["min-w-52"] },
            { label: 'entities.coverage.fields.nature', property: 'nature', type: 'text', visible: true, },
            { label: 'entities.coverage.fields.isFree', property: 'isFree', type: 'text', visible: true, },

            { label: 'entities.coverage.fields.calculationMode', property: 'calculationMode', type: 'text', visible: true, },
            { label: 'entities.coverage.custom_fields.capital', property: 'maxCapital', type: 'collapse', visible: true, collapseOptions: [
                    { label: 'entities.coverage.fields.isFixed', property: 'isFixed', type: 'text', visible: true, },
                    { label: 'entities.coverage.fields.fixedCapital', property: 'fixedCapital', type: 'text', visible: true, },
                    {
                        label: 'entities.coverage.custom_fields.min',
                        property: 'minCapital',
                        type: 'text',
                        visible: true
                    },
                    {
                        label: 'entities.coverage.custom_fields.max',
                        property: 'maxCapital',
                        type: 'text',
                        visible: true
                    }
                ]
            },
            { label: 'entities.coverage.fields.prorata', property: 'prorata', type: 'text', visible: true },
            { label: 'entities.coverage.fields.order', property: 'order', type: 'text', visible: true },
        ],
        imageOptions: {
            label: 'coverage.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: Coverage, property: keyof Coverage) => {

            if (property === 'nature') {
                let nature = element.nature;
                if (!nature || nature === 'null' || nature === 'undefined') {
                    return "Facultative";
                }
                return this._translateService.translate(`entities.coverage.options.nature.${element.nature}`);
            }

            if (property === 'isFree') {
                return element.isFree ? this._translateService.translate('enums.yes') : this._translateService.translate('enums.no');
            }

            if (property === 'isFixed') {
                return element.isFixed ? this._translateService.translate('enums.yes') : this._translateService.translate('enums.no');
            }

            if (property === 'calculationMode') {
                return this._translateService.translate(`entities.coverage.options.calculationMode.${element.calculationMode}`);
            }

            if (property === 'reference') {
                return element.reference?.designation || " - ";
            }

            if (property === 'prorata') {
                return element.prorata ? this._translateService.translate('enums.yes') : this._translateService.translate('enums.no');
            }

            if (element[property] === null || element[property] === undefined) {
                return " - ";
            }

            if (property === 'product') {
                return element.product?.name || " - ";
            }

            if (property === 'managementEntity') {
                return element.managementEntity.name || " - ";
            }



            return element[property];
        },
    };
    data: Coverage[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Coverage> = new MatTableDataSource();
    selection = new SelectionModel<Coverage>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: Product = {} as Product;
    products: Product[] = [];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _coverageService: CoverageService,
        private _translateService: TranslocoService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.buildHeaders();

        this._coverageService.coverages$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: Coverage[]) => {


                this.products = data
                    .map(coverage => coverage.product)
                    .filter((product, index, self) =>
                        index === self.findIndex((p) => p.id === product.id)
                    );

                this.selectedProduct = this.products[0] || {} as Product;
                this.data = data;
                // this.dataSource.data = data;
                this.dataSource.data = this.data.filter(coverage => coverage.product.id === this.selectedProduct.id);
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

        this.tableOptions.renderItem = (element: Coverage, property: keyof Coverage) => {
            if (property === 'product') {
                return element.product?.name || '--';
            }

            if (property === 'managementEntity') {
                return element.managementEntity?.name || '--';
            }

            if (property === 'nature') {
                return this._translateService.translate(`entities.coverage.options.nature.${element.nature}`);
            }

            if (property === 'calculationMode') {
                return this._translateService.translate(`entities.coverage.options.calculationMode.${element.calculationMode}`);
            }

            if (property === 'isFree') {
                return element.isFree ? this._translateService.translate('enums.yes') : this._translateService.translate('enums.no');
            }
            if (property === 'isFixed') {
                return element.isFixed ? this._translateService.translate('enums.yes') : this._translateService.translate('enums.no');
            }
            if (element[property] === null || element[property] === undefined) {
                return '--';
            }

            return element[property];
        }

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
                this.dataSource.data = this.data.filter(coverage => coverage.product.id === this.selectedProduct.id);
                this.dataSource.paginator = this.paginator;
                this._changeDetectorRef.detectChanges();
            }
        })
    }

    openAddDialog(): void {
        this._dialog.open(CoveragesFormComponent, {
            width: '700px',
            data: {
                mode: 'add',
                product: this.selectedProduct,
            }
        }).afterClosed().subscribe((result: Coverage) => {
            if (result) {
                
            }
        })
    }

    openEditDialog(item: any): void {
        const dialogRef = this._dialog.open(CoveragesEditDialogComponent, {
            width: '700px',
            data: item
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // Appeler ici le service pour mettre à jour les données
                this._coverageService.update(item.id, result).subscribe(() => {
                    // rechargement, toast, etc.
                    this._coverageService.getAll().subscribe((data: Coverage[]) => {
                        this.data = data;
                        this.dataSource.data = data;
                        this._changeDetectorRef.detectChanges();
                    });
                });
            }
        });
    }

    openDeleteDialog(item: any): void { }

    onView(element: Coverage): void {
        this.openEditDialog(element);
    }
    
    onDelete(element: Coverage): void {
        // this._coverageService.delete(element.id).subscribe(() => {
        //     this.data = this.data.filter(item => item.id !== element.id);
        //     this.dataSource.data = this.data;
        //     this._changeDetectorRef.detectChanges();
        // });
    }

    trackByProperty(index: number, column: TableColumn<Coverage>) {
        return column.property;
    }
}