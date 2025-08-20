import {SelectionModel} from "@angular/cdk/collections";
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {UntypedFormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {PERMISSIONS} from "@core/permissions/permissions.data";
import {PermissionsService} from "@core/permissions/permissions.service";
import {ManagementEntity} from "@core/services/administration/management-entity/management-entity.interface";
import {Product} from "@core/services/settings/product/product.interface";
import {animations} from "@lhacksrt/animations";
import {TableOptions, TableColumn} from "@lhacksrt/components/table/table.interface";
import {Subject, takeUntil} from "rxjs";
import {VehicleModelFormComponent} from "../form/form.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmDeleteComponent} from "@shared/components/confirm-delete/confirm-delete.component";
import {VehicleModel} from "@core/services/settings/vehicle/referential/model/vehicle-model.model";
import {VehicleModelService} from "@core/services/settings/vehicle/referential/model/vehicle-model.service";

@Component({
  selector: "app-vehicle-model-list",
  templateUrl: "./list.component.html",
  animations: animations
})
export class VehicleModelListComponent implements OnInit, AfterViewInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  tableOptions!: TableOptions<VehicleModel>;

  // Pour les mat-header-row
  groupHeader: string[] = [];
  subHeader: string[] = [];
  visibleColumns: string[] = [];

  dataSource = new MatTableDataSource<VehicleModel>([]); // Ajoute les données réelles ici

  doResolve() {
    this._vehicleModelService.getAll()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  loadValues() {
    this._vehicleModelService.vehicleModels$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((vehicleModels: VehicleModel[]) => {
        this.dataSource.data = vehicleModels;
        this.data = vehicleModels;
      });
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

  ngOnInit(): void {

    this.doResolve();

    this.loadValues()

    // Configuration du contrôle de recherche
    this.searchCtrl.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(value => {
        this.applyFilter(value);
      });

    // Initialisation de la configuration de la table
    this.tableOptions = {
      title: '',
      columns: [
        {label: 'entities.vehicle-model.fields.name', property: 'name', type: 'text', visible: true},
        {label: 'entities.vehicle-model.fields.motorizationType', property: 'motorizationType', type: 'text', visible: true},
        {label: 'entities.vehicle-model.fields.bodywork', property: 'bodywork', type: 'text', visible: true},
        {label: 'entities.vehicle-model.fields.placeCount', property: 'placeCount', type: 'text', visible: true},
        {label: 'entities.vehicle-model.fields.hasTurbo', property: 'hasTurbo', type: 'text', visible: true},
        {label: 'entities.vehicle-model.fields.horsepower', property: 'horsepower', type: 'text', visible: true},
        {label: 'entities.vehicle-model.fields.displacement', property: 'displacement', type: 'text', visible: true},
        {label: 'entities.vehicle-model.fields.weight', property: 'weight', type: 'text', visible: true},
        {label: 'entities.vehicle-model.fields.nature', property: 'nature', type: 'text', visible: true},
      ],
      pageSize: 8,
      pageSizeOptions: [5, 6, 8],
      actions: [],
      renderItem: (element: VehicleModel, property: keyof VehicleModel) => {
        if (property === 'hasTurbo') {
          return element.hasTurbo ? 'Oui' : 'Non';
        }
        return element[property] ?? '--';
      },
    };

    // Construction des lignes d’en-tête
    this.buildHeaderRows();
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Configuration du filtre personnalisé
      this.dataSource.filterPredicate = (data: VehicleModel, filter: string) => {
        const searchText = filter.toLowerCase();

        return true;
      };
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  /**
   * Applique un filtre de recherche sur les données du tableau
   */
  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Efface le filtre de recherche
   */

  constructor(
    private _permissionService: PermissionsService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _vehicleModelService: VehicleModelService,
  ) {
  }

  managementEntity: ManagementEntity = new ManagementEntity({});

  searchCtrl: UntypedFormControl = new UntypedFormControl();
  data: VehicleModel[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<VehicleModel>(true, []);
  // searchInputControl: UntypedFormControl = new UntypedFormControl();

  doIfHasAllSelections(
    action: () => void
  ): any {

    action();
  }

  onAdd(): void {
    this.doIfHasAllSelections(() => {
      this._dialog.open(VehicleModelFormComponent, {
        width: '600px',
        disableClose: true,
        data: {
          mode: 'create',
        }
      }).afterClosed().subscribe((result) => {
        if (result) {
          this.doResolve()
        }
      });
    });

  }

  onDelete(entity: VehicleModel): void {
    this._dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: {
        title: 'entities.vehicle-model.delete.title',
        message: 'entities.vehicle-model.delete.message',
        confirmButtonText: 'actions.delete',
        cancelButtonText: 'actions.cancel'
      }
    }).afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._vehicleModelService.delete(entity.id)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._snackBar.open(
              ('entities.vehicle-model.delete.success'),
              'OK',
              {duration: 3000}
            );
            this.doResolve();
          }, error => {
            this._snackBar.open(
              ('entities.vehicle-model.delete.error'),
              'OK',
              {duration: 3000}
            );
          });
      }
    });

  }

  /**
   * Edit VehicleModel
   */
  onEdit(entity: VehicleModel): void {
    this._dialog.open(VehicleModelFormComponent, {
      width: '600px',
      disableClose: true,
      data: {
        mode: 'edit',
        ...entity
      }
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.doResolve()
      }
    });
  }

  onView(entity: VehicleModel): void {
    //this._router.navigate(['/administration/products/list']);
  }

  onButtonClick(product: Product, column: string): void {
    if (column === 'productionRegistry') {
      alert('Production Registry button clicked for product: ' + product.name);
    }
  }

  hasPermission(product: Product): boolean {
    let hasPerm = this._permissionService.hasPermission(PERMISSIONS.UPDATE_PRODUCTS);
    if (!hasPerm) {
      return false;
    } else if (this.managementEntity.type === "MARKET_LEVEL_ORGANIZATION") {
      return true;
    } else if (this.managementEntity.type === "COMPANY" && product.visibility === "PRIVATE") {
      return true;
    } else
      return false;
  }


  trackByProperty(index: number, column: TableColumn<VehicleModel>) {
    return column.property;
  }
}
