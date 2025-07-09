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
import {AccessoriesFormComponent} from "../form/form.component";
import { TaxAccessory } from "@core/services/settings/tax-accessory/tax-accessory.interface";
import { TaxAccessoryService } from "@core/services/settings/tax-accessory/tax-accessory.service";

@Component({
    selector: "app-tax-accessories-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class AccessoriesListComponent implements OnInit {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions!: TableOptions<TaxAccessory>;

    // Pour les mat-header-row
    groupHeader: string[] = [];
    subHeader: string[] = [];
    visibleColumns: string[] = [];

    dataSource = new MatTableDataSource<TaxAccessory>([]); // Ajoute les données réelles ici

        constructor(
        private _taxAccessoryService: TaxAccessoryService,
        private _permissionService: PermissionsService,
        private _managementEntityService: ManagementEntityService,
        private _tanslateService: TranslocoService,
        private _router: Router,
        private _dialog: MatDialog
    ) {
        this._taxAccessoryService.taxAccessories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: TaxAccessory[]) => {
                this.data = data;
                this.dataSource.data = data;
            });

        this._managementEntityService.entity$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: ManagementEntity) => {
                this.managementEntity = data;
            });
    }


    data: TaxAccessory[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    selection = new SelectionModel<TaxAccessory>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    managementEntity: ManagementEntity = new ManagementEntity({});




    ngOnInit(): void {
        // Initialisation de la configuration de la table
    
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
                    label: 'Taux forfaitaire',
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
                    property: 'product',
                    type: 'text',
                    label: 'Produit associé',
                    visible: true,
                },
            ],
            pageSize: 8,
            pageSizeOptions: [5, 6, 8],
            actions: [],
            renderItem: (element: TaxAccessory, property: keyof TaxAccessory) => {
                if (property === 'taxType') {
                    return element.taxType.name; // Affiche le nom du type de taxe
                } else if (property === 'product') {
                    return element.product.name; // Affiche le nom du produit associé
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
        * Edit TaxAccessory TaxAccessory
        */
    onEdit(TaxAccessory: TaxAccessory): void {

    }



    onView(TaxAccessory: TaxAccessory): void {
    }

    onButtonClick(TaxAccessory: TaxAccessory, column: string): void {
        if (column === 'TaxAccessoryionRegistry') {
            alert('TaxAccessoryion Registry button clicked for TaxAccessory: ' + TaxAccessory.name);
        }
    }

    // hasPermission(TaxAccessory: TaxAccessory): boolean {
    //     let hasPerm = this._permissionService.hasPermission(PERMISSIONS.UPDATE_TAX_ACCESSORIES);
    //     if (!hasPerm) {
    //         return false;
    //     } else if (this.managementEntity.type === "MARKET_LEVEL_ORGANIZATION") {
    //         return true;
    //     } else if (this.managementEntity.type === "COMPANY" && TaxAccessory.visibility === "PRIVATE") {
    //         return true;
    //     } else
    //         return false;
    // }


    trackByProperty(index: number, column: TableColumn<TaxAccessory>) {
        return column.property;
    }
}
