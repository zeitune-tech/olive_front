import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { PermissionsService } from "@core/permissions/permissions.service";
import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";
import { ManagementEntityService } from "@core/services/administration/management-entity/management-entity.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { TranslocoService } from "@jsverse/transloco";
import { TaxPrime } from "@core/services/settings/tax-primes/tax-primes.interface";
import { TaxPrimeService } from "@core/services/settings/tax-primes/tax-primes.service";

@Component({
    selector: "app-TaxPrimes-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class PrimesListComponent implements OnInit {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions!: TableOptions<TaxPrime>;

    // Pour les mat-header-row
    groupHeader: string[] = [];
    subHeader: string[] = [];
    visibleColumns: string[] = [];

    dataSource = new MatTableDataSource<TaxPrime>([]); // Ajoute les données réelles ici

        constructor(
        private _taxPrimeService: TaxPrimeService,
        private _permissionService: PermissionsService,
        private _managementEntityService: ManagementEntityService,
        private _tanslateService: TranslocoService,
        private _router: Router,
        private _dialog: MatDialog
    ) {
        this._taxPrimeService.taxPrimes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: TaxPrime[]) => {
                this.data = data;
                this.dataSource.data = data;
            });

        this._managementEntityService.entity$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: ManagementEntity) => {
                this.managementEntity = data;
            });
    }


    data: TaxPrime[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    selection = new SelectionModel<TaxPrime>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    managementEntity: ManagementEntity = new ManagementEntity({});




    ngOnInit(): void {
        // Initialisation de la configuration de la table
        // id: string;
        //   name: string;
        //   dateEffective: string; 
        //   calculationBase: string;
        //   isFlatRate: boolean;
        //   flatRateAmount: number | null;
        //   rate: number | null;
        //   taxType: TaxType;
        //   coverage: Coverage;
        //   product: Product;
        this.tableOptions = {
            title: '',
            columns: [
                {
                    property: 'name',
                    type: 'text',
                    label: 'Nom',
                    visible: true,
                },
                {
                    property: 'dateEffective',
                    type: 'text',
                    label: 'Date d’effet',
                    visible: true,
                },
                {
                    property: 'calculationBase',
                    type: 'text',
                    label: 'Base de calcul',
                    visible: true,
                },
                {
                    property: 'isFlatRate',
                    type: 'text',
                    label: 'Forfaitaire',
                    visible: true,
                },
                {
                    property: 'flatRateAmount',
                    type: 'text',
                    label: 'Montant forfaitaire',
                    visible: true,
                },
                {
                    property: 'rate',
                    type: 'text',
                    label: 'Taux (%)',
                    visible: true,
                },
                {
                    property: 'taxType',
                    type: 'text',
                    label: 'Type de taxe',
                    visible: true,
                },
                {
                    property: 'coverage',
                    type: 'text',
                    label: 'Couverture',
                    visible: true,
                },
                {
                    property: 'product',
                    type: 'text',
                    label: 'Produit associé',
                    visible: true,
                },
            ],
            pageSize: 8,
            pageSizeOptions: [5, 6, 8],
            actions: [],
            renderItem: (element: TaxPrime, property: keyof TaxPrime) => {
                if (property === 'taxType') {
                    return element.taxType.name; // Affiche le nom du type de taxe
                } else if (property === 'coverage') {
                    return element.coverage.nature; // Affiche le nom de la couverture
                } else if (property === 'product') {
                    return element.product.name; // Affiche le nom du produit associé
                    // // Ajoutez d'autres propriétés si nécessaire
                }
                return element[property]; // Pour les autres propriétés, retourne la valeur par défaut
            }
        };

        // Construction des lignes d’en-tête
        this.buildHeaderRows();
    }

    buildHeaderRows(): void {
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

    /**
        * Edit TaxPrime TaxPrime
        */
    onEdit(TaxPrime: TaxPrime): void {

    }


    onView(TaxPrime: TaxPrime): void {
    }

    onButtonClick(TaxPrime: TaxPrime, column: string): void {
        if (column === 'TaxPrimeionRegistry') {
            alert('TaxPrimeion Registry button clicked for TaxPrime: ' + TaxPrime.name);
        }
    }

    // hasPermission(TaxPrime: TaxPrime): boolean {
    //     let hasPerm = this._permissionService.hasPermission(PERMISSIONS.UPDATE_TaxPrimeS);
    //     if (!hasPerm) {
    //         return false;
    //     } else if (this.managementEntity.type === "MARKET_LEVEL_ORGANIZATION") {
    //         return true;
    //     } else if (this.managementEntity.type === "COMPANY" && TaxPrime.visibility === "PRIVATE") {
    //         return true;
    //     } else
    //         return false;
    // }

    // hasPermission(TaxPrime: TaxPrime): boolean {
    //     return this._permissionService.hasPermission(PERMISSIONS.UPDATE_TAX_PRIMES);
    // }


    trackByProperty(index: number, column: TableColumn<TaxPrime>) {
        return column.property;
    }
}
