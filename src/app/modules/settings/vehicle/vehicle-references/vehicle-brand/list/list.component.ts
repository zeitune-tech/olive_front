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
import {VehicleBrandFormComponent} from "../form/form.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmDeleteComponent} from "@shared/components/confirm-delete/confirm-delete.component";
import {VehicleBrand} from "@core/services/settings/vehicle/referential/brand/vehicle-brand.model";
import {VehicleBrandService} from "@core/services/settings/vehicle/referential/brand/vehicle-brand.service";

@Component({
  selector: "app-vehicle-brand-list",
  templateUrl: "./list.component.html",
  animations: animations
})
export class VehicleBrandListComponent implements OnInit, AfterViewInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  tableOptions!: TableOptions<VehicleBrand>;

  // Pour les mat-header-row
  groupHeader: string[] = [];
  subHeader: string[] = [];
  visibleColumns: string[] = [];

  dataSource = new MatTableDataSource<VehicleBrand>([]); // Ajoute les données réelles ici

  doResolve() {
    this._vehicleBrandService.getAll()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  loadValues() {
    this._vehicleBrandService.vehicleBrands$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((vehicleBrands: VehicleBrand[]) => {
        this.dataSource.data = vehicleBrands;
        this.data = vehicleBrands;
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
        {label: 'entities.vehicle-brand.fields.name', property: 'name', type: 'text', visible: true},
        {label: 'entities.vehicle-brand.fields.models', property: 'models', type: 'text', visible: true},
      ],
      pageSize: 8,
      pageSizeOptions: [5, 6, 8],
      actions: [],
      renderItem: (element: VehicleBrand, property: keyof VehicleBrand) => {
        if (property === 'models') {
          return element.models && element.models.length > 0
            ? element.models.map(model => model.name).join(', ')
            : '--';
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
      this.dataSource.filterPredicate = (data: VehicleBrand, filter: string) => {
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
    private _vehicleBrandService: VehicleBrandService,
  ) {
  }

  managementEntity: ManagementEntity = new ManagementEntity({});

  searchCtrl: UntypedFormControl = new UntypedFormControl();
  data: VehicleBrand[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<VehicleBrand>(true, []);
  // searchInputControl: UntypedFormControl = new UntypedFormControl();

  doIfHasAllSelections(
    action: () => void
  ): any {

    action();
  }

  onAdd(): void {
    this.doIfHasAllSelections(() => {
      this._dialog.open(VehicleBrandFormComponent, {
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

  onDelete(entity: VehicleBrand): void {
    this._dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: {
        title: 'entities.vehicle-brand.delete.title',
        message: 'entities.vehicle-brand.delete.message',
        confirmButtonText: 'actions.delete',
        cancelButtonText: 'actions.cancel'
      }
    }).afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._vehicleBrandService.delete(entity.id)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._snackBar.open(
              ('entities.vehicle-brand.delete.success'),
              'OK',
              {duration: 3000}
            );
            this.doResolve();
          }, error => {
            this._snackBar.open(
              ('entities.vehicle-brand.delete.error'),
              'OK',
              {duration: 3000}
            );
          });
      }
    });

  }

  /**
   * Edit VehicleBrand
   */
  onEdit(entity: VehicleBrand): void {
    this._dialog.open(VehicleBrandFormComponent, {
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

  onView(entity: VehicleBrand): void {
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


  trackByProperty(index: number, column: TableColumn<VehicleBrand>) {
    return column.property;
  }
}
