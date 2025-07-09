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
import { TaxExemption } from "@core/services/settings/tax-exemption/tax-exemption.interface";
import { TaxExemptionService } from "@core/services/settings/tax-exemption/tax-exemption.service";

@Component({
    selector: "app-TaxExemptions-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class ExemptionListComponent implements OnInit {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions!: TableOptions<TaxExemption>;

    // Pour les mat-header-row
    groupHeader: string[] = [];
    subHeader: string[] = [];
    visibleColumns: string[] = [];

    dataSource = new MatTableDataSource<TaxExemption>([]); // Ajoute les données réelles ici

        constructor(
        private _taxExemptionService: TaxExemptionService,
        private _permissionService: PermissionsService,
        private _managementEntityService: ManagementEntityService,
        private _tanslateService: TranslocoService,
        private _router: Router,
        private _dialog: MatDialog
    ) {
        this._taxExemptionService.taxExemptions$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: TaxExemption[]) => {
                this.data = data;
                this.dataSource.data = data;
            });

        this._managementEntityService.entity$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: ManagementEntity) => {
                this.managementEntity = data;
            });
    }


    data: TaxExemption[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    selection = new SelectionModel<TaxExemption>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    managementEntity: ManagementEntity = new ManagementEntity({});




    ngOnInit(): void {
        // Initialisation de la configuration de la table
        this.tableOptions = {
            title: '',
            columns: [
                { label: 'entities.tax_exemption.fields.name', property: 'name', visible: true, type: 'text' },
               { label: 'entities.tax_exemption.fields.taxes', property: 'taxes', visible: true, type: 'text' },
            ],
            pageSize: 8,
            pageSizeOptions: [5, 6, 8],
            actions: [],
            renderItem: (element: TaxExemption, property: keyof TaxExemption) => {
                if (property === 'taxes') {
                    return element.taxes.map(t => t.designation + t.nature).join(', ');
                }
                return element[property];
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
        * Edit TaxExemption TaxExemption
        */
    onEdit(TaxExemption: TaxExemption): void {

    }

    onShare(TaxExemption: TaxExemption): void {

    }

    onView(TaxExemption: TaxExemption): void {
        //this._router.navigate(['/administration/TaxExemptions/list']);
    }

    onButtonClick(TaxExemption: TaxExemption, column: string): void {
        if (column === 'TaxExemptionionRegistry') {
            alert('TaxExemptionion Registry button clicked for TaxExemption: ' + TaxExemption.name);
        }
    }

    // hasPermission(TaxExemption: TaxExemption): boolean {
    //     let hasPerm = this._permissionService.hasPermission(PERMISSIONS.UPDA);
    //     if (!hasPerm) {
    //         return false;
    //     } else if (this.managementEntity.type === "MARKET_LEVEL_ORGANIZATION") {
    //         return true;
    //     } else if (this.managementEntity.type === "COMPANY" && TaxExemption.visibility === "PRIVATE") {
    //         return true;
    //     } else
    //         return false;
    // }


    trackByProperty(index: number, column: TableColumn<TaxExemption>) {
        return column.property;
    }
}
